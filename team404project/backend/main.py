from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fpdf import FPDF
import ee, geemap, uuid, os, geopandas as gpd


# =====================================================
# FASTAPI APP
# =====================================================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# EARTH ENGINE INIT
# =====================================================
try:
    ee.Initialize()
except Exception:
    ee.Authenticate()
    ee.Initialize()

# =====================================================
# LOAD AHMEDABAD WARDS ONCE
# =====================================================
WARD_FILE = "assets/ahmedabad_wards.zip"

gdf = gpd.read_file(f"zip://{WARD_FILE}")
gdf = gdf.to_crs(epsg=4326)

def gdf_to_ee(gdf):
    feats = []
    for _, row in gdf.iterrows():
        geom = ee.Geometry(row.geometry.__geo_interface__)
        props = row.drop("geometry").to_dict()
        props["ward_name"] = props.get("sourceward", "Ward")
        feats.append(ee.Feature(geom, props))
    return ee.FeatureCollection(feats)

wards_ee = gdf_to_ee(gdf)

# =====================================================
# ADVANCED HEAT VULNERABILITY INDEX (HVI)
# =====================================================
def compute_priority(wards):

    modis = (
        ee.ImageCollection("MODIS/061/MOD11A1")
        .filterDate("2025-04-01", "2025-06-30")
    )

    lst_day = (
        modis.select("LST_Day_1km")
        .mean()
        .multiply(0.02)
        .subtract(273.15)
        .unitScale(32, 48)
    )

    lst_night = (
        modis.select("LST_Night_1km")
        .mean()
        .multiply(0.02)
        .subtract(273.15)
        .unitScale(22, 35)
    )

    s2 = (
        ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
        .filterDate("2025-01-01", "2025-06-30")
        .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 60))
        .select(["B4", "B8"])
        .median()
    )

    ndvi = s2.normalizedDifference(["B8", "B4"])
    veg_deficit = ee.Image(1).subtract(ndvi).unitScale(0.2, 0.8)

    population = (
        ee.ImageCollection("WorldPop/GP/100m/pop")
        .mean()
        .unitScale(0, 8000)
    )

    builtup = (
        ee.Image("ESA/WorldCover/v100/2020")
        .eq(50)
        .focal_mean(200)
        .unitScale(0, 1)
    )

    priority = (
        lst_day.multiply(0.30)
        .add(lst_night.multiply(0.15))
        .add(population.multiply(0.25))
        .add(builtup.multiply(0.15))
        .add(veg_deficit.multiply(0.15))
    ).clip(wards.geometry())

    return priority

# =====================================================
# API: WARD PRIORITY (AUTO LOAD)
# =====================================================
@app.post("/ward-priority")
def ward_priority():
    priority = compute_priority(wards_ee)

    out = priority.reduceRegions(
        collection=wards_ee,
        reducer=ee.Reducer.percentile([75]),
        scale=250
    )

    return geemap.ee_to_geojson(out)


# =====================================================
# API: TOP 10 PDF
# =====================================================
@app.post("/top10-pdf")
def top10_pdf():
    priority = compute_priority(wards_ee)

    out = priority.reduceRegions(
        collection=wards_ee,
        reducer=ee.Reducer.percentile([75]),
        scale=250
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
    pdf.cell(0, 10, "Top 10 Heat Risk Wards – Ahmedabad", ln=True)

    pdf.set_font("Arial", size=11)
    for i, f in enumerate(top10, 1):
        pdf.cell(
            0, 8,
            f"{i}. {f['properties'].get('ward_name')} – {f['properties']['p75']:.2f}",
            ln=True
        )

    file_path = f"top10_{uuid.uuid4().hex[:6]}.pdf"
    pdf.output(file_path)

    return {"file": file_path}
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
