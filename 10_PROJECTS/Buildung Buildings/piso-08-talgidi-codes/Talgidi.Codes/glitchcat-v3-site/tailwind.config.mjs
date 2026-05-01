/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				black: '#000000',
				orange: {
					DEFAULT: '#FF4F18',
					hover: '#E54615',
				},
				blue: {
					neon: '#0055FF',
					glow: 'rgba(0, 85, 255, 0.5)',
				},
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace'],
			},
			letterSpacing: {
				tighter: '-0.05em',
				widest: '0.25em',
			},
		},
	},
	plugins: [],
}
