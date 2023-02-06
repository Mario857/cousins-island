import Hero from './components/Hero/Hero'
import Layout from 'components/Layout/Layout'
import NewestCollections from './components/NewestCollections/NewestCollections'

import { useSelector } from 'react-redux'
import { State } from 'store/store'
import TrendingCollections from './components/TrendingCollections/TrendingCollections'

const HomePage = () => {
	const { collectionsLoaders } = useSelector((state: State) => state.collections)

	return (
		<Layout
			loading={false} // ={collectionsLoaders?.getCollections}
		>
			<Hero />
			<NewestCollections />
			<TrendingCollections />
			{/* <Trending /> */}
			{/* <UpcomingProjects /> */}
			{/* <Explore /> */}
		</Layout>
	)
}

export default HomePage
