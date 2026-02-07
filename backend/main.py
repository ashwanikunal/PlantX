from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fpdf import FPDF
import ee, geemap, uuid

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Earth Engine (auth done once manually)
ee.Initialize()

class WardRequest(BaseModel):
    geojson: dict

def extract_ward_name(props):
    for key in ["ward_name","WARD_NAME","WARD","Name","NAME"]:
        if key in props and isinstance(props[key], str):
            return props[key]
    return "Unknown Ward"

def geojson_to_ee(geojson):
    feats = []
    for f in geojson["features"]:
        name = extract_ward_name(f.get("properties", {}))
        feats.append(ee.Feature(f["geometry"], {"ward_name": name}))
    return ee.FeatureCollection(feats)

def compute_priority(wards):
    lst = (
        ee.ImageCollection("MODIS/061/MOD11A1")
        .filterDate("2024-04-01", "2024-06-30")
        .select("LST_Day_1km")
        .mean()
        .multiply(0.02)
        .subtract(273.15)
    )

    s2 = (
        ee.ImageCollection("COPERNICUS/S2_SR")
        .filterDate("2024-01-01", "2024-12-31")
        .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 70))
        .select(["B4", "B8"])
        .median()
    )
    ndvi = s2.normalizedDifference(["B8", "B4"])

    pop = ee.ImageCollection("WorldPop/GP/100m/pop").mean()

    return (
        lst.unitScale(30, 48).pow(1.4).multiply(0.5)
        .add(pop.unitScale(0, 5000).pow(1.3).multiply(0.3))
        .add(ee.Image(1).subtract(ndvi).pow(1.2).multiply(0.2))
    ).clip(wards.geometry())

@app.post("/ward-priority")
def ward_priority(req: WardRequest):
    wards = geojson_to_ee(req.geojson)
    priority = compute_priority(wards)
    out = priority.reduceRegions(
        wards, ee.Reducer.percentile([75]), 500
    )
    return geemap.ee_to_geojson(out)

@app.post("/top10-pdf")
def top10_pdf(req: WardRequest):
    wards = geojson_to_ee(req.geojson)
    priority = compute_priority(wards)

    out = priority.reduceRegions(
        wards, ee.Reducer.percentile([75]), 500
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
        pdf.cell(
            0, 8,
            f"{i}. {f['properties']['ward_name']} | Priority: {f['properties'].get('p75',0):.2f}",
            ln=True
        )

    file_path = f"top10_wards_{uuid.uuid4().hex[:6]}.pdf"
    pdf.output(file_path)
    return {"file": file_path}
