import React, { useEffect, useCallback } from 'react' // Usunięto useState
import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient, editData, fetchData } from '../util/http'

const Checkbox = ({ id }) => {
	const { mutate: mutateCheckbox } = useMutation({
		mutationFn: editData,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['checkbox'] })
		},
	})

	const { mutate: mutateTimestamp } = useMutation({
		mutationFn: editData,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['timestamp'] })
		},
	})

	const { data: checkboxesData } = useQuery({
		queryKey: ['checkbox'],
		queryFn: ({ signal }) => fetchData({ signal, path: 'checkboxes' }),
	})

	const { data: timestampData } = useQuery({
		queryKey: ['timestamp'],
		queryFn: ({ signal }) => fetchData({ signal, path: 'clickTimes' }),
	})

	const handleCheckboxChange = async event => {
		const isChecked = event.target.checked
		mutateCheckbox({ path: 'checkboxes', id: id, data: isChecked })
		mutateTimestamp({ path: 'clickTimes', id: id, data: Date.now() })
	}

	// Owinięcie funkcji w useCallback, aby Netlify nie zgłaszało błędów zależności
	const check24Hours = useCallback(() => {
		if (timestampData && timestampData[id]) {
			const now = new Date()
			const clickDate = new Date(timestampData[id])
			clickDate.setDate(clickDate.getDate() + 3)

			if (now > clickDate) {
				mutateCheckbox({ path: 'checkboxes', id: id, data: false })
				mutateTimestamp({ path: 'clickTimes', id: id, data: Date.now() })
			}
		}
	}, [id, timestampData, mutateCheckbox, mutateTimestamp]);

	useEffect(() => {
		const intervalId = setInterval(() => {
			check24Hours()
		}, 10000)

		return () => clearInterval(intervalId)
	}, [check24Hours]) // Teraz zależnością jest stabilna funkcja check24Hours

	let content = null; // Zmieniono na null (dobra praktyka w React)
	if (checkboxesData && timestampData) {
		content = (
			<div className='absolute top-3 right-9'>
				<input
					className='h-5 w-5 absolute cursor-pointer accent-pink-500'
					type='checkbox'
					id={id}
					checked={checkboxesData[id] || false} // Dodano fallback
					onChange={handleCheckboxChange}
				/>
			</div>
		)
	}

	return <>{content}</>
}

export default Checkbox
