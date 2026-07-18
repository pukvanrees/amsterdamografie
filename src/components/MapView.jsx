import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";

const AMSTERDAM_CENTER = [52.3702, 4.8925];

const guessIcon = new L.DivIcon({
  className: "",
  html: '<div class="pin pin-guess"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const targetIcon = new L.DivIcon({
  className: "",
  html: '<div class="pin pin-target"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function ClickHandler({ onMapClick, active }) {
  useMapEvents({
    click(e) {
      if (active) onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function ViewController({ guess, targetPath, questionId }) {
  const map = useMap();

  useEffect(() => {
    if (guess && targetPath) {
      const points = [guess, ...targetPath.flat()];
      map.flyToBounds(L.latLngBounds(points), { padding: [80, 80], duration: 0.6, maxZoom: 17 });
    } else {
      map.flyTo(AMSTERDAM_CENTER, 14, { duration: 0.6 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId, guess, targetPath]);

  return null;
}

export default function MapView({ onMapClick, awaitingAnswer, guess, targetPath, nearestPoint, questionId }) {
  const mapRef = useRef(null);

  return (
    <MapContainer
      center={AMSTERDAM_CENTER}
      zoom={14}
      minZoom={12}
      maxZoom={18}
      className="map"
      ref={mapRef}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
      />
      <ClickHandler onMapClick={onMapClick} active={awaitingAnswer} />

      {guess && <Marker position={guess} icon={guessIcon} />}

      {targetPath &&
        targetPath.map((line, i) =>
          line.length === 1 ? (
            <Marker key={i} position={line[0]} icon={targetIcon} />
          ) : (
            <Polyline
              key={i}
              positions={line}
              pathOptions={{ color: "#2f7a3d", weight: 5, opacity: 0.85 }}
            />
          )
        )}

      {guess && nearestPoint && (
        <Polyline
          positions={[guess, nearestPoint]}
          pathOptions={{ color: "#e8734a", weight: 2, dashArray: "6 6" }}
        />
      )}

      <ViewController guess={guess} targetPath={targetPath} questionId={questionId} />
    </MapContainer>
  );
}
