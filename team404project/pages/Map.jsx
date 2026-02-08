import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import WardTreeTable from "./WardTreeTable";

export default function Map() {
  const mapRef = useRef(null);
  const allWardsLayerRef = useRef(null);
  const top10LayerRef = useRef(null);
  const selectedWardRef = useRef(null);
  const sliderRef = useRef(null);

  /* ================= COLOR SCALE ================= */
  const getColor = (v) => {
    v = Math.max(0, Math.min(1, v));
    return `rgb(${255 * v}, ${255 * (1 - v) * 0.6}, ${150 * (1 - v)})`;
  };

  /* ================= LABEL VISIBILITY ================= */
  const toggleLabelsByZoom = (map) => {
    const zoom = map.getZoom();
    [allWardsLayerRef.current, top10LayerRef.current].forEach((group) => {
      if (!group) return;
      group.eachLayer((geo) => {
        geo.eachLayer((l) => {
          if (!l.getTooltip()) return;
          zoom > 12 ? l.openTooltip() : l.closeTooltip();
        });
      });
    });
  };

  /* ================= MAP INIT ================= */
  useEffect(() => {
    const street = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
    const dark = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    );

    const map = L.map("map", {
      center: [23.03, 72.58],
      zoom: 11,
      layers: [street],
    });

    const allWardsLayer = L.layerGroup().addTo(map);
    const top10Layer = L.layerGroup();

    mapRef.current = map;
    allWardsLayerRef.current = allWardsLayer;
    top10LayerRef.current = top10Layer;

    L.control.layers(
      { Street: street, Dark: dark },
      {
        "All Wards (Priority)": allWardsLayer,
        "Top 10 High Priority Wards": top10Layer,
      },
      { collapsed: false }
    ).addTo(map);

    map.on("zoomend", () => toggleLabelsByZoom(map));

    loadWardData();

    return () => map.remove();
  }, []);

  /* ================= WARD CLICK ================= */
  const handleWardClick = (layer) => {
    // reset previous
    if (selectedWardRef.current) {
      selectedWardRef.current.setStyle({
        weight: selectedWardRef.current._defaultWeight,
      });
    }

    // store default weight once
    if (!layer._defaultWeight) {
      layer._defaultWeight = layer.options.weight;
    }

    layer.setStyle({
      weight: layer._defaultWeight + 2,
    });

    layer.bringToFront();
    selectedWardRef.current = layer;
  };

  /* ================= LOAD DATA ================= */
  const loadWardData = async () => {
    const res = await fetch("http://localhost:8000/ward-priority", {
      method: "POST",
    });
    const data = await res.json();

    const sorted = [...data.features].sort(
      (a, b) => b.properties.p75 - a.properties.p75
    );

    const top10 = sorted.slice(0, 10);

    allWardsLayerRef.current.clearLayers();
    top10LayerRef.current.clearLayers();

    /* ---------- ALL WARDS ---------- */
    const allLayer = L.geoJSON(data.features, {
      style: (f) => ({
        color: "#444",
        weight: 0.8,
        fillColor: getColor(f.properties.p75),
        fillOpacity: 0.75,
      }),
      onEachFeature: (f, l) => {
        l.bindTooltip(f.properties.ward_name, {
          direction: "center",
          className: "ward-label",
        });
        l.on("click", () => handleWardClick(l));
      },
    });

    /* ---------- TOP 10 ---------- */
    const topLayer = L.geoJSON(top10, {
      style: (f) => ({
        color: "#000",
        weight: 1.6,
        fillColor: getColor(f.properties.p75),
        fillOpacity: 0.9,
      }),
      onEachFeature: (f, l) => {
        l.bindTooltip(f.properties.ward_name, {
          direction: "center",
          className: "ward-label",
        });
        l.on("click", () => handleWardClick(l));
      },
    });

    allWardsLayerRef.current.addLayer(allLayer);
    top10LayerRef.current.addLayer(topLayer);

    mapRef.current.fitBounds(allLayer.getBounds());
    toggleLabelsByZoom(mapRef.current);

    document.getElementById("list").innerHTML =
      top10
        .map(
          (f, i) =>
            `<div><b>${i + 1}. ${f.properties.ward_name}</b> – ${f.properties.p75.toFixed(
              2
            )}</div>`
        )
        .join("");
  };

  /* ================= WHAT-IF ================= */
  const handleSlider = () => {
    const value = sliderRef.current.value;
    document.getElementById("greenValue").innerText = value + "%";

    top10LayerRef.current.eachLayer((g) => {
      g.eachLayer((l) => {
        const base = l.feature.properties.p75 || 0;
        l.setStyle({
          fillColor: getColor(Math.max(0, base - value * 0.01)),
        });
      });
    });
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div id="map" style={{ width: "100%", height: "100%" }} />

      {/* PANEL */}
      <div style={panelStyle}>
        <h3>Ahmedabad – Top 10 Wards</h3>

        <h4>What-If: Increase Green Cover</h4>
        <input
          type="range"
          ref={sliderRef}
          min="0"
          max="30"
          defaultValue="0"
          onInput={handleSlider}
        />
        <span id="greenValue">0%</span>

        <div id="list" style={{ marginTop: "10px" }} />
      <button className="bg-green-400 rounded-md p-2" onClick={() => window.location.href = "/WardTreeTable"}> Show Trees</button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const panelStyle = {
  position: "absolute",
  top: "250px",
  right: "20px",
  width: "260px",
  padding: "12px",
  background: "#fafafa",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0,0,0,0.25)",
  zIndex: 1200,
};
