import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function NeighborhoodMap({ neighborhoods }) {
  return (
    <MapContainer
      center={[12.9716, 77.5946]}
      zoom={11}
      style={{
  height: "450px",
  width: "95%",
  margin: "40px auto",
  borderRadius: "12px"
}}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {neighborhoods.map((n, index) => {
        if (!n.lat || !n.lon) return null;

        return (
          <Marker key={index} position={[parseFloat(n.lat), parseFloat(n.lon)]}>
            <Popup>
              <strong>{n.name}</strong>
              <br />
              ⭐ Match Score: {n.match_score}
              <br />
              Safety: {n.safety_score}
              <br />
              Rent: ₹{n.avg_rent}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default NeighborhoodMap;
