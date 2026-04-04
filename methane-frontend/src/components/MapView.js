"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function MapView({ lat, lon }) {
  const position = lat && lon ? [lat, lon] : [20.5937, 78.9629]; // India default

  return (
    <MapContainer
      center={position}
      zoom={5}
      scrollWheelZoom={true}
      className="h-full w-full rounded-xl"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {lat && lon && (
        <Marker position={[lat, lon]}>
          <Popup>
            📍 Selected Location <br />
            Lat: {lat}, Lon: {lon}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}