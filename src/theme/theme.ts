import { createTheme } from '@mui/material'
import { palette } from './palette'
import '@fontsource/libre-franklin'

declare module '@mui/material/styles' {
	interface Theme {
		status: {
			danger: React.CSSProperties['color']
		}
	}

	interface Palette {
		light: Palette['primary']
	}

	interface TypographyVariants {
		body4: React.CSSProperties
		body3: React.CSSProperties
		h900: React.CSSProperties
		h800: React.CSSProperties
		h700: React.CSSProperties
		h600: React.CSSProperties
		h500: React.CSSProperties
		h400: React.CSSProperties
		h300: React.CSSProperties
		h200: React.CSSProperties
		h100: React.CSSProperties
	}
}

// allow configuration using `createTheme`
declare module '@mui/material/styles' {
	interface PaletteOptions {
		light?: PaletteOptions['primary']
		dark?: PaletteOptions['primary']
		tertiary?: PaletteOptions['primary']
	}
}

// Update the Button's color prop options
declare module '@mui/material/Button' {
	interface ButtonPropsColorOverrides {
		light: true
		dark: true
		tertiary: true
	}
}

// Update the Switch's color prop options
declare module '@mui/material/Switch' {
	interface SwitchPropsColorOverrides {
		light: true
		dark: true
		tertiary: true
	}
}

declare module '@mui/material/Typography' {
	interface TypographyPropsVariantOverrides {
		body4: true
		body3: true
		h900: true
		h800: true
		h700: true
		h600: true
		h500: true
		h400: true
		h300: true
		h200: true
		h100: true
	}
}

let theme = createTheme({
	breakpoints: {
		values: {
			xs: 0,
			sm: 700,
			md: 1011,
			lg: 1280,
			xl: 1400,
		},
	},
	palette: {
		mode: 'dark',
		primary: {
			main: palette.teal[200],
			light: palette.teal[50],
			dark: palette.teal[600],
		},
		secondary: {
			main: palette.green[400],
			light: palette.green[300],
		},
		error: {
			main: palette.red[300],
			dark: palette.red[400],
			light: palette.red[200],
		},
		warning: {
			main: palette.orange[300],
			dark: palette.orange[400],
			light: palette.orange[200],
		},
		success: {
			main: palette.green[300],
			dark: palette.green[400],
			light: palette.green[200],
		},
		info: {
			main: palette.blue[300],
			dark: palette.blue[400],
			light: palette.blue[200],
		},
		light: {
			light: '#e2e2e3',
			main: '#ffffff',
			dark: '#5f6061',
		},
		dark: {
			main: palette.secondaryGray[900],
			light: '#171616',
		},
		tertiary: {
			light: palette.alphaLight[100],
			main: palette.alphaLight[50],
		},
		grey: {
			...palette.gray,
			A100: palette.secondaryGray[100],
			A200: palette.secondaryGray[200],
		},
		text: {
			primary: palette.alphaLight[800],
			secondary: palette.alphaLight[600],
		},
	},
	typography: {
		fontFamily: "'Inter', sans-serif",
		fontSize: 16,
	},
	components: {
		MuiButtonBase: {
			defaultProps: {
				disableRipple: true,
			},
		},
		MuiInput: {
			defaultProps: {
				disableUnderline: true,
			},
		},
		MuiTooltip: {
			styleOverrides: {
				tooltip: {
					backgroundColor: '#353b51',
					color: 'white',
					padding: 6,
					borderRadius: 4,
					boxShadow: 'none',
				},
				arrow: {
					color: '#353b51',
				},
			},
		},
	},
})

theme = {
	...theme,
	typography: {
		...theme.typography,
		body4: {
			fontFamily: "'Libre Franklin', sans-serif",
			fontSize: 16,
			lineHeight: '24px',
			[theme.breakpoints.up('md')]: {
				fontSize: 18,
				lineHeight: '24px',
			},
		},
		body3: {
			fontFamily: "'Libre Franklin', sans-serif",
			fontSize: 16,
		},
		body2: {
			fontFamily: "'Libre Franklin', sans-serif",
			fontSize: 14,
			lineHeight: '20px',
		},
		body1: {
			fontFamily: "'Libre Franklin', sans-serif",
			fontSize: 12,
			lineHeight: '18px',
		},
		h900: {
			fontSize: 40,
			fontWeight: 700,
			lineHeight: '48px',
			[theme.breakpoints.up('md')]: {
				fontSize: 72,
				fontWeight: 700,
				lineHeight: '108px',
			},
		},
		h800: {
			fontSize: 32,
			fontWeight: 700,
			lineHeight: '36px',
			[theme.breakpoints.up('md')]: {
				fontSize: 56,
				lineHeight: '84px',
			},
		},
		h700: {
			fontSize: 32,
			fontWeight: 700,
			lineHeight: '40px',
			[theme.breakpoints.up('md')]: {
				fontSize: 48,
				lineHeight: '60px',
			},
		},
		h600: {
			fontSize: 19,
			fontWeight: 700,
			lineHeight: '24px',
			[theme.breakpoints.up('md')]: {
				fontSize: 32,
				lineHeight: '48px',
			},
		},
		h500: {
			fontSize: 16,
			fontWeight: 700,
			lineHeight: '18px',
			[theme.breakpoints.up('md')]: {
				fontSize: 24,
				lineHeight: '36px',
			},
		},
		h400: {
			fontSize: 16,
			fontWeight: 700,
			lineHeight: '20px',
			[theme.breakpoints.up('md')]: {
				fontSize: 20,
				lineHeight: '32px',
			},
		},
		h300: {
			fontSize: 16,
			fontWeight: 600,
			lineHeight: '24px',
		},
		h200: {
			fontSize: 14,
			fontWeight: 600,
			lineHeight: '20px',
		},
		h100: {
			fontSize: 12,
			fontWeight: 600,
			lineHeight: '16px',
		},
	},
}

export default theme
