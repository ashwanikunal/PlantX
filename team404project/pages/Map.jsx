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

  /* ================= COLOR ================= */
  const getColor = (v) => {
    v = Math.max(0, Math.min(1, v));
    const boosted = Math.pow(v, 0.6);
    return `rgb(${255 * boosted},${180 * (1 - boosted)},${120 *
      (1 - boosted)})`;
  };

  /* ================= INIT ================= */
  useEffect(() => {
    const street = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    );
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
      {
        Street: street,
        Satellite: satellite,
        Terrain: terrain,
        Dark: dark,
      },
      {
        "All Wards": allLayer,
        "Top-10 High Priority": top10Layer,
      },
      { collapsed: false }
    ).addTo(map);

    map.on("zoomend", () => toggleLabels(map));

    loadWardData();

    return () => map.remove();
  }, []);

  /* ================= LABELS ================= */
  const toggleLabels = (map) => {
    const zoom = map.getZoom();
    [allLayerRef.current, top10LayerRef.current].forEach((group) => {
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

    if (!layer._defaultWeight)
      layer._defaultWeight = layer.options.weight;

    layer.setStyle({ weight: layer._defaultWeight + 2 });
    selectedWardRef.current = layer;

    layer.bindPopup(`
      <b>${props.ward_name}</b><br/>
      HVI: ${props.p75.toFixed(3)}<br/>
    `).openPopup();
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

    allLayerRef.current.clearLayers();
    top10LayerRef.current.clearLayers();

    const allGeo = L.geoJSON(data.features, {
      style: (f) => ({
        color: "#444",
        weight: 0.8,
        fillColor: getColor(f.properties.p75),
        fillOpacity: 0.7,
      }),
      onEachFeature: (f, l) => {
        l.bindTooltip(f.properties.ward_name, { direction: "center" });
        l.on("click", () => handleWardClick(l, f.properties));
      },
    });

    const top10Geo = L.geoJSON(top10, {
      style: (f) => ({
        color: "#000",
        weight: 1.8,
        fillColor: getColor(f.properties.p75),
        fillOpacity: 0.9,
      }),
      onEachFeature: (f, l) => {
        l.bindTooltip(f.properties.ward_name, { direction: "center" });
        l.on("click", () => handleWardClick(l, f.properties));
      },
    });

    allLayerRef.current.addLayer(allGeo);
    top10LayerRef.current.addLayer(top10Geo);
    mapRef.current.fitBounds(allGeo.getBounds());
    toggleLabels(mapRef.current);
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <div id="map" style={{ width: "100%", height: "100%" }} />

      <button
        onClick={() => navigate("/WardTreeTable")}
        style={{
          position: "absolute",
          top: "200px",
          right: "20px",
          padding: "8px 12px",
          background: "#2ecc71",
          borderRadius: "6px",
          zIndex: 1200,
        }}
      >
         Recommend Trees
      </button>
    </div>
  );
}
