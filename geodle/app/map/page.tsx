'use client'
import dynamic from "next/dynamic";
import { useMemo } from "react";

export default function Map() {
	const Map = useMemo(
		() =>
			dynamic(() => import("../components/Map/map"), {
				loading: () => (
					<div className="flex justify-center items-center h-screen w-screen">
						<span className="loading loading-spinner loading-lg"></span>
					</div>
				),
				ssr: false,
			}),
		[]
	);

	return (
		<div>
			<Map />
		</div>
	);
}
