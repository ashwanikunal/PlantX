import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import tree from "../src/assets/trees.png";

export default function TreesPlant() {
  const mapRef = useRef(null);
  const treeLayerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    /* ================= BASE MAPS ================= */
    const street = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      { attribution: "© OpenStreetMap" }
    );

    const satellite = L.tileLayer(
      "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
      { subdomains: ["mt0", "mt1", "mt2", "mt3"] }
    );

    /* ================= MAP ================= */
    const map = L.map("map", {
      center: [23.03, 72.58],
      zoom: 13,
      layers: [street],
    });

    mapRef.current = map;

    /* ================= TREE LAYER ================= */
    const treeLayer = L.layerGroup().addTo(map);
    treeLayerRef.current = treeLayer;

    /* ================= LAYER CONTROL ================= */
    L.control
      .layers(
        { Street: street, Satellite: satellite },
        { "Tree Locations": treeLayer },
        { collapsed: false }
      )
      .addTo(map);

    /* ================= TREE ICON ================= */
    const treeIcon = L.icon({
      iconUrl: tree,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
    });

    /* ================= LOAD POINTS ================= */
    fetch("/points.geojson")
      .then((res) => res.json())
      .then((data) => {
        const geoLayer = L.geoJSON(data, {
          pointToLayer: (_, latlng) =>
            L.marker(latlng, { icon: treeIcon }),
          onEachFeature: (feature, layer) => {
            layer.bindPopup(
              `<b>${feature.properties?.name || "Tree Location"}</b>`
            );
          },
        });

        treeLayer.addLayer(geoLayer);
        map.fitBounds(geoLayer.getBounds(), { padding: [40, 40] });
      });

    return () => map.remove();
  }, []);

  /* ================= LAYOUT ================= */
  return (
    <div style={{ display: "flex", width: "100%", height: "100vh" }}>
      {/* SIDEBAR */}
      <div
        style={{
          width: "300px",
          background: "#1f2a2e",
          color: "#fff",
          padding: "20px",
        }}
      >
        <h3 style={{ marginBottom: "10px", color: "#6ddc8b" }}>
          Tree Plantation Planner
        </h3>

        <p style={{ opacity: 0.85 }}>
          AI-recommended locations where trees can be planted for maximum
          heat-reduction impact.
        </p>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <button onClick={() => navigate("/TreesPlant")} style={btn}>
            Free / Open area to plant
          </button>

          <button onClick={() => navigate("/WardTreeTable")} style={btn}>
            Recommend trees
          </button>

          <button onClick={() => navigate("/WardTreeTable")} style={btn}>
            Maintain tree health
          </button>
        </div>
      </div>

      {/* MAP */}
      <div style={{ flex: 1 }}>
        <div id="map" style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}

/* ================= BUTTON STYLE ================= */
const btn = {
  padding: "10px",
  background: "#2ecc71",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};
