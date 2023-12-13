import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

export async function fetchCountersData() {
	const response = await fetch('https://pill-planner-default-rtdb.firebaseio.com/counters.json')
	if (!response.ok) {
		const error = new Error('Błąd ładowania danych')
		error.code = response.status
		error.info = await response.json()
		throw error
	}
	const countersData = await response.json()
	return countersData
}

export async function editCounterData({ path, count }) {
	const response = await fetch(`https://pill-planner-default-rtdb.firebaseio.com/counters/${path}.json`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(count),
	})

	if (!response.ok) {
		const error = new Error('Błąd dodawania danych')
		error.code = response.status
		error.info = await response.json()
		throw error
	}
}
