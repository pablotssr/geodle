"use client";
import dynamic from "next/dynamic.js";
import { useMemo } from "react";
export default function MyPage() {
  const Map = useMemo(
    () =>
      dynamic(() => import("./components/map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  const position = [46.603354, 1.888334];

  return <div>{/* <Map position={position} zoom="6" /> */}</div>;
}
