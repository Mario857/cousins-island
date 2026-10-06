import type { Theme } from '@mui/material/styles'

// styled-components receives the MUI theme (see App.tsx), so type it as one.
declare module 'styled-components' {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	export interface DefaultTheme extends Theme {}
}
