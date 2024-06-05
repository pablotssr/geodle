"use client";
import GamePanel from "./components/GamePanel";

export default function Page() {
	return (
		<div className="h-full flex flex-col items-center justify-center gap-2 m-16">
			<GamePanel />
		</div>
	);
}
