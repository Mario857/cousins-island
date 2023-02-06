import React, { useState } from 'react'
import Tabs from 'components/Tabs/Tabs'
import Tab from 'components/Tabs/Tab'
import TabPanel from 'components/Tabs/TabPanel'
import Offers from './Offers'
import { StyledAbout, StyledContent } from './About.styled'
import Traits from './Traits'
import queryString from 'query-string'
import { useHistory, useLocation } from 'react-router-dom'
import Activity from './Activity/Activity'

const About = () => {
	const history = useHistory()
	const location = useLocation()

	const parsedQuery = queryString.parse(location.search)

	const [value, setValue] = useState(parseInt(parsedQuery.tab as string) || 0)

	const handleChange = (e: React.SyntheticEvent, newValue: number) => {
		setValue(newValue)

		history.replace({
			pathname: location.pathname,
			search: `?tab=${newValue}`,
		})
	}

	const tabs = [
		{
			label: 'Traits',
			value: 0,
			children: <Traits />,
		},
		{
			label: 'Offers',
			value: 1,
			children: <Offers />,
		},
		{
			label: 'Activity',
			value: 2,
			children: <Activity />,
		},
	]

	return (
		<StyledAbout>
			<Tabs
				value={value}
				onChange={handleChange}
				TabIndicatorProps={{
					style: {
						background: 'white',
						height: 2,
					},
				}}
			>
				{tabs.map(tab => (
					<Tab label={tab.label} value={tab.value} key={`about-tab-${tab.value}`} />
				))}
			</Tabs>
			{tabs.map(tab => (
				<TabPanel
					value={value}
					index={tab.value}
					key={`about-tab-panel-${tab.value}`}
				>
					<StyledContent>{tab.children}</StyledContent>
				</TabPanel>
			))}
		</StyledAbout>
	)
}

export default About
