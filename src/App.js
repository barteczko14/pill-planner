import React, { useState, useEffect } from 'react'
import Menu from './components/Menu'
import ChartComponent from './ChartComponent'
import Counter from './components/Counter'
import LoadingPage from './components/LoadingPage'

const App = () => {
	const [fetching, setIsFetching] = useState(false)
	const [sum, setSum] = useState(0)
	const [average, setAverage] = useState(0)
	const [countersData, setCountersData] = useState({})

	const daysOrder = ['poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota', 'niedziela']

	useEffect(() => {
		async function fetchData() {
			setIsFetching(true)
			try {
				const response = await fetch('https://pill-planner-default-rtdb.firebaseio.com/counters.json')
				const responseData = await response.json()
				const correctOrder = {}
				daysOrder.forEach(day => {
					correctOrder[day] = responseData[day]
				})
				setCountersData(correctOrder)
				const sum = Object.values(responseData).reduce((accumulator, value) => accumulator + value, 0)
				setSum(sum)
				setAverage((sum / 7).toFixed(2))
				if (!response.ok) {
					throw new Error('Error')
				}
			} catch (error) {
				alert('Błąd pobierania danych!')
			}
			setIsFetching(false)
		}
		fetchData()
	}, [])

	return (
		<>
			{fetching ? (
				<LoadingPage></LoadingPage>
			) : (
				<>
					<Menu sum={sum} average={average}></Menu>
					<div className='flex flex-wrap justify-center'>
						{Object.entries(countersData).map(([day, count]) => (
							<Counter key={day} counterData={count}>
								{day}
							</Counter>
						))}
					</div>
					<ChartComponent></ChartComponent>
				</>
			)}
		</>
	)
}

export default App
