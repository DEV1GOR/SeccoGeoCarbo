import {
  MapContainer,
  TileLayer,
  Polygon,
  Tooltip,
  useMap,
} from "react-leaflet";

// Componente auxiliar para ajustar o zoom automaticamente nos limites da fazenda
const FitBounds = ({ coords }) => {
  const map = useMap();
  if (coords && coords.length > 0) {
    map.fitBounds(coords);
  }
  return null;
};

const MapComponent = ({ coords, farmName }) => {
  // Coordenadas padrão (Centro do Brasil) caso não venha nada
  const defaultCenter = [-14.235, -51.9253];

  // URL do Satélite (Esri World Imagery)
  const satelliteURL =
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  const attribution = '&copy; <a href="https://www.esri.com/">Esri</a>';

  return (
    <MapContainer
      center={defaultCenter}
      zoom={4}
      style={{ width: "100%", height: "100%", borderRadius: "1rem" }}
      zoomControl={false} // Vamos tirar o controle padrão para ficar clean
    >
      {/* Camada de Satélite */}
      <TileLayer url={satelliteURL} attribution={attribution} />

      {/* Desenho da Fazenda (Polígono) */}
      {coords && (
        <>
          <Polygon
            positions={coords}
            pathOptions={{
              color: "#10B981",
              fillColor: "#10B981",
              fillOpacity: 0.4,
            }}
          >
            <Tooltip sticky>{farmName || "Sua Fazenda"}</Tooltip>
          </Polygon>
          <FitBounds coords={coords} />
        </>
      )}
    </MapContainer>
  );
};

export default MapComponent;
