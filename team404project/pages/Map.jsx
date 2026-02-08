import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

export default function Map() {
  const mapRef = useRef(null);
  const allLayerRef = useRef(null);
  const top10LayerRef = useRef(null);
  const selectedWardRef = useRef(null);
  const navigate = useNavigate();

  /* ================= COLOR (QUANTILE BASED) ================= */
 const getColor = (v, breaks) => {
  let t;
  if (v >= breaks[4]) t = 1;
  else if (v >= breaks[3]) t = 0.85;
  else if (v >= breaks[2]) t = 0.65;
  else if (v >= breaks[1]) t = 0.4;
  else t = 0.15;

  /* HSL interpolation */
  const hue = 120 - 120 * t;     // green → red
  const light = 85 - 45 * t;     // light → dark
  const sat = 85;

  return `hsl(${hue}, ${sat}%, ${light}%)`;
};

  /* ================= INIT MAP ================= */
  useEffect(() => {
    const street = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
    const satellite = L.tileLayer(
      "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
      { subdomains: ["mt0", "mt1", "mt2", "mt3"] }
    );
    const terrain = L.tileLayer(
      "https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
      { subdomains: ["mt0", "mt1", "mt2", "mt3"] }
    );
    const dark = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    );

    const map = L.map("map", {
      center: [23.03, 72.58],
      zoom: 11,
      layers: [street],
    });

    mapRef.current = map;

    const allLayer = L.layerGroup().addTo(map);
    const top10Layer = L.layerGroup().addTo(map);

    allLayerRef.current = allLayer;
    top10LayerRef.current = top10Layer;

    L.control.layers(
      { Street: street, Satellite: satellite, Terrain: terrain, Dark: dark },
      { "All Wards": allLayer, "Top-10 High Priority": top10Layer },
      { collapsed: false }
    ).addTo(map);

    map.on("zoomend", () => toggleLabels(map));

    loadWardData();

    return () => map.remove();
  }, []);

  /* ================= LABEL VISIBILITY ================= */
  const toggleLabels = (map) => {
    const zoom = map.getZoom();
    [allLayerRef.current, top10LayerRef.current].forEach((group) => {
      if (!group) return;
      group.eachLayer((geo) =>
        geo.eachLayer((l) =>
          zoom > 12 ? l.openTooltip() : l.closeTooltip()
        )
      );
    });
  };

  /* ================= CLICK ================= */
  const handleWardClick = (layer, props) => {
    if (selectedWardRef.current) {
      selectedWardRef.current.setStyle({
        weight: selectedWardRef.current._defaultWeight,
      });
    }

    if (!layer._defaultWeight) {
      layer._defaultWeight = layer.options.weight;
    }

    layer.setStyle({ weight: layer._defaultWeight + 2 });
    selectedWardRef.current = layer;

    mapRef.current.fitBounds(layer.getBounds(), { padding: [40, 40] });

    layer
      .bindPopup(
        `<b>${props.ward_name}</b><br/>HVI: ${props.p75.toFixed(3)}`
      )
      .openPopup();
  };

  /* ================= LOAD DATA ================= */
  const loadWardData = async () => {
    const res = await fetch("http://localhost:8000/ward-priority", {
      method: "POST",
    });
    const data = await res.json();

    const values = data.features
      .map((f) => f.properties.p75)
      .filter((v) => !isNaN(v))
      .sort((a, b) => a - b);

    const q = (p) => values[Math.floor(p * values.length)];
    const breaks = [q(0.2), q(0.4), q(0.6), q(0.8), q(1)];

    const sorted = [...data.features].sort(
      (a, b) => b.properties.p75 - a.properties.p75
    );
    const top10 = sorted.slice(0, 10);

    allLayerRef.current.clearLayers();
    top10LayerRef.current.clearLayers();

    /* ---------- ALL WARDS ---------- */
    const allGeo = L.geoJSON(data.features, {
      style: (f) => ({
        color: "#333",
        weight: 0.8,
        fillColor: getColor(f.properties.p75, breaks),
        fillOpacity: 0.85,
      }),
      onEachFeature: (f, l) => {
        l.bindTooltip(f.properties.ward_name, {
          direction: "center",
          className: "ward-label",
        });
        l.on("click", () => handleWardClick(l, f.properties));
      },
    });

    /* ---------- TOP 10 (FIXED) ---------- */
    const top10Geo = L.geoJSON(top10, {
      style: (f) => ({
        color: "#000",
        weight: 2,
        fillColor: getColor(f.properties.p75, breaks),
        fillOpacity: 0.95,
      }),
      onEachFeature: (f, l) => {
        l.bindTooltip(f.properties.ward_name, {
          direction: "center",
          className: "ward-label",
        });
        l.on("click", () => handleWardClick(l, f.properties));
      },
    });

    allLayerRef.current.addLayer(allGeo);
    top10LayerRef.current.addLayer(top10Geo);

    mapRef.current.fitBounds(allGeo.getBounds());
    toggleLabels(mapRef.current);

    addLegend(breaks);
  };

  /* ================= LEGEND ================= */
 const addLegend = (breaks) => {
  // ✅ remove previous legend if it exists
  if (legendRef.current) {
    legendRef.current.remove();
  }

  const legend = L.control({ position: "bottomleft" });

  legend.onAdd = () => {
    const div = L.DomUtil.create(
      "div",
      "bg-white p-3 text-xs shadow rounded"
    );

    div.innerHTML = `
      <div style="font-weight:600; margin-bottom:6px; text-align:center;">
        Heat Vulnerability Index
      </div>

      <!-- LOW -->
      <div style="text-align:center; font-size:10px; margin-bottom:4px;">
        Low
      </div>

      <!-- GRADIENT -->
      <div style="
        height:140px;
        width:18px;
        border-radius:4px;
        margin: 0 auto;
        background: linear-gradient(
          to bottom,
          hsl(120,85%,85%),
          hsl(80,85%,70%),
          hsl(50,85%,58%),
          hsl(25,85%,48%),
          hsl(0,85%,40%)
        );
      "></div>

      <!-- HIGH -->
      <div style="text-align:center; font-size:10px; margin-top:4px;">
        High
      </div>
    `;

    return div;
  };

  legend.addTo(mapRef.current);
  legendRef.current = legend; // 🔥 store reference
};


  /* ================= LAYOUT ================= */
  return (
    <div style={{ display: "flex", width: "100%", height: "100vh" }}>
      {/* SIDEBAR */}
      <div style={{ width: "300px", background: "#1f2a2e", color: "#fff", padding: "20px" }}>
        <p>Identify high-heat-risk wards and optimal tree plantation zones.</p>

        <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <button onClick={() => navigate("/TreesPlant")} style={btn}>Free / Open area to plant</button>
          <button onClick={() => navigate("/WardTreeTable")} style={btn}>Recommend trees</button>
          <button onClick={() => navigate("/WardTreeTable")} style={btn}>Maintain tree health</button>
        </div>
      </div>

      {/* MAP */}
      <div style={{ flex: 1 }}>
        <div id="map" style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}

const btn = {
  padding: "10px",
  background: "#2ecc71",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};
