import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import tree from "../src/assets/tree.jpeg";

export default function TreesPlant() {
  const mapRef = useRef(null);
  const treeLayerRef = useRef(null);

  useEffect(() => {
    /* ================= BASE MAPS ================= */
    const street = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      { attribution: "© OpenStreetMap" }
    );

    const satellite = L.tileLayer(
      "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
      {
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
        attribution: "© Google Satellite",
      }
    );

    /* ================= MAP ================= */
    const map = L.map("map", {
      center: [23.03, 72.58],
      zoom: 13,
      layers: [street], // default layer
    });

    mapRef.current = map;

    /* ================= TREE LAYER ================= */
    const treeLayer = L.layerGroup().addTo(map);
    treeLayerRef.current = treeLayer;

    /* ================= LAYER CONTROL ================= */
    L.control
      .layers(
        {
          Street: street,
          Satellite: satellite,
        },
        {
          "Tree Locations": treeLayer,
        },
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
          pointToLayer: (feature, latlng) =>
            L.marker(latlng, { icon: treeIcon }),

          onEachFeature: (feature, layer) => {
            layer.bindPopup(
              `<b>${feature.properties?.name || "Tree Location"}</b>`
            );
          },
        });

        treeLayer.addLayer(geoLayer);
        map.fitBounds(geoLayer.getBounds());
      });

    return () => map.remove();
  }, []);

  return (
    <div className="w-full h-screen">
      <div id="map" className="w-full h-full" />
    </div>
  );
}
