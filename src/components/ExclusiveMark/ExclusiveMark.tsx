import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Tooltip from '@mui/material/Tooltip'
import Box, { BoxProps } from '@mui/material/Box'

interface ExclusiveMarkProps {
	isExclusive: boolean
	sx?: BoxProps['sx']
}

const ExclusiveMark: React.FC<ExclusiveMarkProps> = ({ isExclusive, sx }) => {
	const checkedIcon = (
		<LazyLoadImage
			src={isExclusive ? '/images/blue-check.svg' : '/images/gray-check.svg'}
			alt='Checked'
			width='18px'
			height='18px'
			style={{ marginBottom: '-1px' }}
		/>
	)

	const title = isExclusive
		? 'Launched on Cousin Island'
		: 'Not launched on Cousin Island'

	return (
		<Box ml={1} component='span' sx={sx}>
			<Tooltip title={title} arrow placement='top'>
				<span>{checkedIcon}</span>
			</Tooltip>
		</Box>
	)
}

export default ExclusiveMark
