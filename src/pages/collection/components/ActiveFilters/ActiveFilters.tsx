import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import ActiveFilter from './ActiveFilter'
import {
	NFTCollectionDetails,
	TokensQuery,
} from 'utils/blockchain/blockchain.interface'
import { toCapitalize } from 'utils/toCapitalize'
import TextButton from 'components/Button/TextButton'

interface ActiveFiltersProps {
	query: TokensQuery
	possibleTraits: NFTCollectionDetails['possibleTraits']
	handleFilterToggle: (
		filterName: string,
		traitValue: string,
		isChecked: boolean
	) => void
	clearFilters: () => void
	totalResults?: number
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
	query,
	possibleTraits,
	handleFilterToggle,
	clearFilters,
	totalResults,
}) => {
	const getActiveFilters = () => {
		let activeFilters = []

		for (const name of Object.keys(query.traitFilters)) {
			for (const value of query.traitFilters[name]) {
				const possibleTraitsForName = possibleTraits[name]
				if (!possibleTraitsForName) {
					throw new Error(`No possible traits found for: ${name}`)
				}
				const traitData = possibleTraitsForName.find(
					(trait: any) => trait.value === value
				)

				activeFilters.push({
					name,
					value,
					rarity: traitData ? traitData.rarity : 0,
				})
			}
		}

		return activeFilters
	}

	const activeFilters = getActiveFilters()

	return activeFilters && activeFilters.length > 0 ? (
		<Box mb={{ md: 2 }} mt={{ xs: 4, md: 0 }}>
			<Stack
				direction={{ xs: 'column', md: 'row' }}
				alignItems={{ md: 'center' }}
				sx={{ flexFlow: 'wrap' }}
			>
				<Stack
					direction='row'
					alignItems='center'
					spacing={2}
					sx={{ mb: { xs: 2, md: 0 } }}
				>
					<Typography
						variant='h200'
						color='text.primary'
						component='h6'
						mr={{ md: 2 }}
						mb={{ md: 2 }}
					>
						Total results: {totalResults || 0}
					</Typography>
					<TextButton
						size='large'
						type='button'
						sx={{
							mb: 2,
							mr: { xs: 'auto', md: 0 },
							display: { xs: 'block', md: 'none' },
						}}
						onClick={clearFilters}
					>
						Reset
					</TextButton>
				</Stack>

				{activeFilters.map((activeFilter, index) => (
					<ActiveFilter
						key={`active-filter-${index}`}
						activeFilter={activeFilter}
						handleFilterToggle={handleFilterToggle}
					/>
				))}
				<TextButton
					size='large'
					type='button'
					sx={{
						mb: 2,
						mr: { xs: 'auto', md: 0 },
						display: { xs: 'none', md: 'block' },
					}}
					onClick={clearFilters}
				>
					Reset
				</TextButton>
			</Stack>
		</Box>
	) : (
		<></>
	)
}

export default ActiveFilters
