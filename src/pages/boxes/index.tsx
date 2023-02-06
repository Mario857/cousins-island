import Button from 'components/Button/Button'
import Heading from 'components/Heading/Heading'
import Layout from 'components/Layout/Layout'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import * as ROUTES from 'constants/routes'

const BoxesPage = () => {
	// const boxes = data.boxes;

	const breadcrumbs = [
		{
			title: 'Homepage',
			href: ROUTES.HOME,
		},
		{
			title: 'Boxes',
		},
	]

	return (
		<Layout breadcrumbs={breadcrumbs}>
			<Stack
				direction={{
					xs: 'column',
					md: 'row',
				}}
				alignItems={{ md: 'center' }}
				justifyContent='space-between'
				sx={{ mb: 4 }}
			>
				<Heading variant='h800' component='h2'>
					Boxes
				</Heading>
				<Stack direction='row' alignItems='center'>
					<Typography variant='h500' color='text.secondary' component='h3' mr={1}>
						COUSIN Power
					</Typography>
					<Typography variant='h500' color='text.primary' component='h3' mr={2}>
						6,854.32
					</Typography>
					<a href={`${ROUTES.STAKING_APP}/trade`} target='_blank'>
						<Button variant='contained' size='medium' color='primary' type='button'>
							BUY MORE $COUSIN
						</Button>
					</a>
				</Stack>
			</Stack>
			{/* {boxes && boxes.length > 0 && (
        <Grid container spacing={4}>
          {boxes.map((box, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={`boxes-box-${index}`}>
              <BoxCard
                {...box}
                button={{
                  title: 'Details',
                  href: `${ROUTES.BOXES}/${box.id}`,
                }}
              />
            </Grid>
          ))}
        </Grid>
      )} */}
		</Layout>
	)
}

export default BoxesPage
