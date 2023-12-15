import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

export async function fetchData({ signal, path }) {
	const response = await fetch(`https://pill-planner-default-rtdb.firebaseio.com/${path}.json`, { signal: signal })
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

export async function addData(newData) {
	const response = await fetch(`https://pill-planner-default-rtdb.firebaseio.com/chartData.json`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(newData),
	})

	if (!response.ok) {
		const error = new Error('Błąd dodawania danych')
		error.code = response.status
		error.info = await response.json()
		throw error
	}
}

export async function deleteData(dataToDelete) {
	const response = await fetch(`https://pill-planner-default-rtdb.firebaseio.com/chartData/${dataToDelete}.json`, {
		method: 'DELETE',
	})

	if (!response.ok) {
		const error = new Error('Błąd dodawania danych')
		error.code = response.status
		error.info = await response.json()
		throw error
	}
}
