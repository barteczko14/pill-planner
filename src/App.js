import React, { useState, useEffect} from 'react'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue } from 'firebase/database'
import Menu from './Menu'
import firebaseConfig from './firebaseConfig'
import ChartComponent from './ChartComponent'
import Counter from './Counter'
import LoadingPage from './LoadingPage'

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

const App = () => {
	const [loading, setLoading] = useState(true)
	const [sum, setSum] = useState(0)
	const [average, setAverage] = useState(0)

	useEffect(() => {
		const counterRef = ref(database, 'counters')
		onValue(counterRef, snapshot => {
			const counters = snapshot.val()
			const sum = Object.values(counters).reduce((accumulator, value) => accumulator + value, 0)
			setSum(sum)
			setAverage((sum / 7).toFixed(2))
			if (counters) {
				setLoading(false)
			}
		})
	}, [sum, average])

	return (
		<div>
			{loading ? (
				<LoadingPage></LoadingPage>
			) : (
				<>
					<Menu sum={sum} average={average}></Menu>
					<Counter counterId='poniedziałek' />
					<Counter counterId='wtorek' />
					<Counter counterId='środa' />
					<Counter counterId='czwartek' />
					<Counter counterId='piątek' />
					<Counter counterId='sobota' />
					<Counter counterId='niedziela' />
					<ChartComponent></ChartComponent>
				</>
			)}
		</div>
	)
}

export default App
