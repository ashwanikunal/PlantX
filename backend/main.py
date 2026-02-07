from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fpdf import FPDF
import ee, geemap, uuid

# ---------------- APP ----------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- EARTH ENGINE INIT ----------------
# Run `earthengine authenticate` ONCE in terminal before this
ee.Initialize()

# ---------------- MODEL ----------------
class WardRequest(BaseModel):
    geojson: dict

# ---------------- HELPERS ----------------
def extract_ward_name(props):
    priority_keys = [
        "sourceward",
        "sourcewa_1",
    ]

    for key in priority_keys:
        if key in props and props[key]:
            return str(props[key])

    return "Unknown Ward"



def geojson_to_ee(geojson):
    feats = []

    # 🔎 Debug once (optional)
    print("SAMPLE PROPERTIES:",
          geojson["features"][0].get("properties", {}))

    for f in geojson["features"]:
        props = f.get("properties", {}).copy()

        # Extract ward name safely
        ward_name = extract_ward_name(props)

        # Normalize key
        props["ward_name"] = ward_name

        feats.append(
            ee.Feature(f["geometry"], props)
        )

    return ee.FeatureCollection(feats)

# ---------------- CORE LOGIC ----------------
def compute_priority(wards):

    # ===============================
    # 1️⃣ Daytime Heat (MODIS)
    # ===============================
    lst = (
        ee.ImageCollection("MODIS/061/MOD11A1")
        .filterDate("2025-04-01", "2025-06-30")
        .select("LST_Day_1km")
        .mean()
        .multiply(0.02)
        .subtract(273.15)
    )

    heat = lst.unitScale(32, 48)

    # ===============================
    # 2️⃣ Vegetation Deficit (NDVI)
    # ===============================
    s2 = (
        ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
        .filterDate("2025-01-01", "2025-06-30")
        .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 60))
        .select(["B4", "B8"])
        .median()
    )

    ndvi = s2.normalizedDifference(["B8", "B4"])
    veg_deficit = ee.Image(1).subtract(ndvi).unitScale(0.2, 0.8)

    # ===============================
    # 3️⃣ Population Exposure
    # ===============================
    population = ee.ImageCollection("WorldPop/GP/100m/pop").mean()
    pop = population.unitScale(0, 7000)

    # ===============================
    # 4️⃣ Built-up Density
    # ===============================
    builtup = ee.Image("ESA/WorldCover/v100/2020").eq(50)
    builtup_density = builtup.focal_mean(200).unitScale(0, 1)

    # ===============================
    # 5️⃣ FINAL PRIORITY (NO NORMALIZATION)
    # ===============================
    priority = (
        heat.multiply(0.35)
        .add(pop.multiply(0.30))
        .add(builtup_density.multiply(0.20))
        .add(veg_deficit.multiply(0.15))
    ).clip(wards.geometry())

    return priority

def compute_priority(wards):

    # ===============================
    # 1️⃣ MODIS Day & Night LST
    # ===============================
    modis = (
        ee.ImageCollection("MODIS/061/MOD11A1")
        .filterDate("2025-04-01", "2025-09-30")
    )

    lst_day = (
        modis.select("LST_Day_1km")
        .mean()
        .multiply(0.02)
        .subtract(273.15)
    )

    lst_night = (
        modis.select("LST_Night_1km")
        .mean()
        .multiply(0.02)
        .subtract(273.15)
    )

    heat_day = lst_day.unitScale(32, 48)
    heat_night = lst_night.unitScale(22, 35)

    # ===============================
    # 2️⃣ Vegetation (NDVI) — FIXED DATASET
    # ===============================
    s2 = (
        ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
        .filterDate("2025-01-01", "2025-12-31")
        .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 50))
        .select(["B4", "B8"])
        .median()
    )

    ndvi = s2.normalizedDifference(["B8", "B4"])
    veg_deficit = ee.Image(1).subtract(ndvi).unitScale(0.25, 0.85)

    # ===============================
    # 3️⃣ Population Exposure
    # ===============================
    population = ee.ImageCollection("WorldPop/GP/100m/pop").mean()
    pop_exposure = population.unitScale(0, 8000)

    # ===============================
    # 4️⃣ Built-up Density
    # ===============================
    builtup = ee.Image("ESA/WorldCover/v100/2020").eq(50)
    builtup_density = builtup.focal_mean(250).unitScale(0, 1)

    # ===============================
    # 5️⃣ Humidity Stress (ERA5)
    # ===============================
    era5 = (
        ee.ImageCollection("ECMWF/ERA5_LAND/HOURLY")
        .filterDate("2025-04-01", "2025-09-30")
        .select("dewpoint_temperature_2m")
        .mean()
        .subtract(273.15)
    )

    humidity_stress = era5.unitScale(18, 28)

    # ===============================
    # 6️⃣ FINAL COMPOSITE SCORE
    # ===============================
    priority = (
        heat_day.multiply(0.25)
        .add(heat_night.multiply(0.15))
        .add(pop_exposure.multiply(0.20))
        .add(builtup_density.multiply(0.15))
        .add(veg_deficit.multiply(0.15))
        .add(humidity_stress.multiply(0.10))
    ).clip(wards.geometry())

    # ===============================
    # 7️⃣ SAFE NORMALIZATION (FIXED)
    # ===============================
    max_val = priority.reduceRegion(
        reducer=ee.Reducer.max(),
        geometry=wards.geometry(),
        scale=500,
        maxPixels=1e9
    ).values().get(0)

    priority = priority.divide(ee.Image.constant(max_val))

    return priority


# ---------------- API: MAP DATA ----------------
@app.post("/ward-priority")
def ward_priority(req: WardRequest):
    wards = geojson_to_ee(req.geojson)
    priority = compute_priority(wards)

    out = priority.reduceRegions(
        collection=wards,
        reducer=ee.Reducer.percentile([75]),
        scale=500
    )

    return geemap.ee_to_geojson(out)

# ---------------- API: TOP 10 PDF ----------------
@app.post("/top10-pdf")
def top10_pdf(req: WardRequest):
    wards = geojson_to_ee(req.geojson)
    priority = compute_priority(wards)

    out = priority.reduceRegions(
        collection=wards,
        reducer=ee.Reducer.percentile([75]),
        scale=500
    )

    data = geemap.ee_to_geojson(out)

    top10 = sorted(
        data["features"],
        key=lambda f: f["properties"].get("p75", 0),
        reverse=True
    )[:10]

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "Top 10 High Priority Wards", ln=True)

    pdf.set_font("Arial", size=11)
    for i, f in enumerate(top10, 1):
        priority_val = f["properties"].get("p75", 0)
        ward_name = f["properties"].get("ward_name", "Unknown Ward")

        pdf.cell(
            0, 8,
            f"{i}. {ward_name} | Priority: {priority_val:.2f}",
            ln=True
        )

    file_path = f"top10_wards_{uuid.uuid4().hex[:6]}.pdf"
    pdf.output(file_path)

    return {"file": file_path}
