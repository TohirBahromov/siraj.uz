"use client";

import { MAP_DEFAULT_CENTER } from "@/constants";
import { useEffect, useRef } from "react";

export default function YandexMapPicker({
  lat,
  lng,
  onPick,
}: {
  lat: number | null;
  lng: number | null;
  onPick: (lat: number, lng: number, address: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const center: [number, number] =
      lat != null && lng != null ? [lat, lng] : MAP_DEFAULT_CENTER;

    const map = new window.ymaps.Map(containerRef.current, {
      center,
      zoom: 13,
      controls: ["zoomControl"],
    });
    mapRef.current = map;

    if (lat != null && lng != null) {
      placeMarker(lat, lng, map);
    }

    map.events.add("click", (e: any) => {
      const coords: [number, number] = e.get("coords");
      const [clat, clng] = coords;
      placeMarker(clat, clng, map);

      window.ymaps
        .geocode(coords, { results: 1 })
        .then((res: any) => {
          const obj = res.geoObjects.get(0);
          const address = obj
            ? obj.getAddressLine()
            : `${clat.toFixed(5)}, ${clng.toFixed(5)}`;
          onPickRef.current(clat, clng, address);
        })
        .catch(() => {
          onPickRef.current(
            clat,
            clng,
            `${clat.toFixed(5)}, ${clng.toFixed(5)}`,
          );
        });
    });

    return () => {
      map.destroy();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync external lat/lng → marker (e.g. when parent loads saved data)
  useEffect(() => {
    if (!mapRef.current || lat == null || lng == null) return;
    placeMarker(lat, lng, mapRef.current);
    mapRef.current.panTo([lat, lng]);
  }, [lat, lng]); // eslint-disable-line react-hooks/exhaustive-deps

  function placeMarker(lat: number, lng: number, map: any) {
    if (markerRef.current) {
      markerRef.current.geometry.setCoordinates([lat, lng]);
    } else {
      markerRef.current = new window.ymaps.Placemark(
        [lat, lng],
        {},
        {
          preset: "islands#redDotIcon",
        },
      );
      map.geoObjects.add(markerRef.current);
    }
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-100 rounded-xl overflow-hidden border border-stone-200"
    />
  );
}
