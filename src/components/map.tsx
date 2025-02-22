"use client";

// External dependencies
import * as mapboxgl from "mapbox-gl";
import { useCallback, useEffect, useRef, useState } from "react";
import Map, {
  GeolocateControl,
  Layer,
  LayerProps,
  MapRef,
  Marker,
  NavigationControl,
  Popup,
  Source,
} from "react-map-gl";
// Hooks & Types
import MapboxGeocoder, {
  type GeocoderOptions,
} from "@mapbox/mapbox-gl-geocoder";
import { useTheme } from "next-themes";
// Styles
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

export interface MapboxProps {
  id?: string;
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  markers?: Array<{
    id: string;
    longitude: number;
    latitude: number;
    popupContent?: React.ReactNode;
    element?: React.ReactNode;
  }>;
  geoJsonData?: GeoJSON.FeatureCollection;
  onMarkerDragEnd?: (lngLat: { lng: number; lat: number }) => void;
  onGeoJsonClick?: (feature: GeoJSON.Feature) => void;
  draggableMarker?: boolean;
  showGeocoder?: boolean;
}

const MAP_STYLES = {
  light: "mapbox://styles/tinkernerd/cm7ewyz2o000901qx4qrq23na",
  dark: "mapbox://styles/tinkernerd/cm7ewvpet00ed01qoeoie08th",
} as const;


const Mapbox = ({
  id,
  initialViewState = {
    longitude: -84.63549803244882,
    latitude: 45.86518667524172,
    zoom: 14,
  },
  markers = [],
  geoJsonData,
  onMarkerDragEnd,
  onGeoJsonClick,
  draggableMarker = false,
  showGeocoder = false,
}: MapboxProps) => {
  const mapRef = useRef<MapRef>(null);
  const { theme } = useTheme();
  const [popupInfo, setPopupInfo] = useState<{
    id: string;
    longitude: number;
    latitude: number;
    content: React.ReactNode;
  } | null>(null);

  // GeoJSON layer style
  const layerStyle: LayerProps = {
    id: "data",
    type: "fill",
    paint: {
      "fill-color": "#0080ff",
      "fill-opacity": 0.5,
    },
  };

  // Add Geocoder control
  useEffect(() => {
    if (!showGeocoder || !mapRef.current) return;

    const map = mapRef.current;
    const geocoderOptions: GeocoderOptions = {
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!,
      mapboxgl: mapboxgl,
    };
    const geocoder = new MapboxGeocoder(geocoderOptions);

    map.getMap().addControl(geocoder);

    return () => {
      if (map) {
        map.getMap().removeControl(geocoder);
      }
    };
  }, [showGeocoder]);

  // Handle GeoJSON click
  const onClick = useCallback(
    (
      event: mapboxgl.MapMouseEvent & {
        features?: mapboxgl.GeoJSONFeature[];
      }
    ) => {
      if (!onGeoJsonClick) return;

      const feature = event.features?.[0];
      if (feature) {
        onGeoJsonClick(feature as GeoJSON.Feature);
      }
    },
    [onGeoJsonClick]
  );

  // Fly to location
  const flyToLocation = useCallback((longitude: number, latitude: number) => {
    mapRef.current?.flyTo({
      center: [longitude, latitude],
      duration: 2000,
      zoom: 14,
    });
  }, []);

  return (
    <Map
      id={id}
      ref={mapRef}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      initialViewState={initialViewState}
      style={{ width: "100%", height: "100%" }}
      mapStyle={MAP_STYLES[theme === "dark" ? "dark" : "light"]}
      interactiveLayerIds={geoJsonData ? ["data"] : undefined}
      onClick={onClick}
    >
      {/* Navigation Controls */}
      <NavigationControl position="bottom-left" />
      <GeolocateControl
        position="bottom-left"
        trackUserLocation
        onGeolocate={(e) => {
          flyToLocation(e.coords.longitude, e.coords.latitude);
        }}
      />

      {/* Markers */}
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          longitude={marker.longitude}
          latitude={marker.latitude}
          draggable={draggableMarker}
          style={{ cursor: draggableMarker ? "grab" : "pointer" }}
          onDragEnd={
            onMarkerDragEnd ? (e) => onMarkerDragEnd(e.lngLat) : undefined
          }
          onClick={() => {
            if (marker.popupContent) {
              setPopupInfo({
                id: marker.id,
                longitude: marker.longitude,
                latitude: marker.latitude,
                content: marker.popupContent,
              });
            }
          }}
        >
          {marker.element}
        </Marker>
      ))}

      {/* Popup */}
      {popupInfo && (
        <Popup
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          anchor="bottom"
          offset={15}
          className="!p-0 !rounded-xl overflow-hidden max-w-none"
          closeButton={false}
          closeOnClick={false}
          onClose={() => setPopupInfo(null)}
        >
          <div className="relative">
            <button
              onClick={() => setPopupInfo(null)}
              className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-white"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            {popupInfo.content}
          </div>
        </Popup>
      )}

      {/* GeoJSON Layer */}
      {geoJsonData && (
        <Source type="geojson" data={geoJsonData}>
          <Layer {...layerStyle} />
        </Source>
      )}
    </Map>
  );
};

export default Mapbox;
