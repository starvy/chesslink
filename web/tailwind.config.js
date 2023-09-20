/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		fontFamily: {
			sans: ["Inter", "sans-serif"],
		},
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			colors: {
				mochabrown: "#A17A57",
				palebrown: "#E3CDAA",
				"cadet-blue": "#4D6D92",
				"off-white": "#ECECD7",
				"dark-white": "#D9D9D9",
				"bright-white": "#EDEDED",
				"dark-gray": "#121212",
				"light-gray": "#262626",
			},
		},
	},
	plugins: [],
};
