import React from 'react'
import Menu from './components/Menu'
import ChartComponent from './ChartComponent'
import Counter from './components/Counter'
import LoadingPage from './components/LoadingPage'
import { fetchCountersData } from './util/http'
import { useQuery } from '@tanstack/react-query'
import ErrorBlock from './components/ErrorBlock'

const App = () => {
	const {
		data: countersData,
		isPending: countersIsPending,
		isError: countersIsError,
	} = useQuery({
		queryKey: ['counters'],
		queryFn: fetchCountersData,
	})

	let content

	if (countersIsPending) {
		content = <LoadingPage></LoadingPage>
	}
	if (countersIsError) {
		content = <ErrorBlock title='Błąd' message='Nie udało się załadować danych' />
	}
	if (countersData) {
		const daysOrder = ['poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota', 'niedziela']

		const correctOrder = {}
		daysOrder.forEach(day => {
			correctOrder[day] = countersData[day]
		})

		content = (
			<>
				<Menu counterData={correctOrder}></Menu>
				<div className='flex flex-wrap justify-center'>
					{Object.entries(correctOrder).map(([day, count]) => (
						<Counter key={day} counterData={count} day={day}></Counter>
					))}
				</div>
				<ChartComponent></ChartComponent>
			</>
		)
	}
	return <>{content}</>
}

export default App
