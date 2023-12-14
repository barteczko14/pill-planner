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

export async function fetchCheckboxesData() {
	const response = await fetch(`https://pill-planner-default-rtdb.firebaseio.com/checkboxes.json`)
	if (!response.ok) {
		const error = new Error('Błąd ładowania danych')
		error.code = response.status
		error.info = await response.json()
		throw error
	}
	const checkboxesData = await response.json()
	return checkboxesData
}

export async function fetchTimestampData() {
	const response = await fetch(`https://pill-planner-default-rtdb.firebaseio.com/clickTimes.json`)
	if (!response.ok) {
		const error = new Error('Błąd ładowania danych')
		error.code = response.status
		error.info = await response.json()
		throw error
	}
	const timestampData = await response.json()
	return timestampData
}

export async function editData({ path, id, data }) {
	const response = await fetch(`https://pill-planner-default-rtdb.firebaseio.com/${path}/${id}.json`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	})

	if (!response.ok) {
		const error = new Error('Błąd dodawania danych')
		error.code = response.status
		error.info = await response.json()
		throw error
	}
}
