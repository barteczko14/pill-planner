import React from 'react'
import Menu from './components/Menu'
import ChartComponent from './components/ChartComponent'
import Counter from './components/Counter'
import LoadingPage from './components/LoadingPage'
import { fetchData } from './util/http'
import { useQuery } from '@tanstack/react-query'
import ErrorBlock from './components/ErrorBlock'

const App = () => {
	const { data, isPending, isError } = useQuery({
		queryKey: ['counters'],
		queryFn: ({ signal }) => fetchData({ signal, path: 'counters' }),
	})

	let content

	if (isPending) {
		content = <LoadingPage></LoadingPage>
	}
	if (isError) {
		content = <ErrorBlock title='Błąd' message='Nie udało się załadować danych' />
	}
	if (data) {
		const daysOrder = ['poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota', 'niedziela']

		const correctOrder = {}
		daysOrder.forEach(day => {
			correctOrder[day] = data[day]
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
