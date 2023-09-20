"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

const Slider = (props: {
	min: number;
	max: number;
	defaultValue: number[];
	onValueChange: (value: number[]) => void;
	onValueCommit?: (value: number[]) => void;
}) => {
	return (
		<SliderPrimitive.Root
			className={
				"relative flex w-full touch-none select-none items-center"
			}
			{...props}
		>
			<SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-[#3E5EED21]">
				<SliderPrimitive.Range className="absolute h-full bg-transparent" />
			</SliderPrimitive.Track>
			<SliderPrimitive.Thumb
				defaultValue={props.defaultValue[0]}
				className="block h-4 w-4 rounded-full border border-[#A49CD2] bg-[#A49CD2] shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
			/>
		</SliderPrimitive.Root>
	);
};

export default Slider;
