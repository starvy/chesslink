import { CSSProperties } from "react";

export function textGradient(background: string): CSSProperties {
	return {
		background,
		backgroundClip: "text",
		WebkitBackgroundClip: "text",
		WebkitTextFillColor: "transparent",
	};
}
