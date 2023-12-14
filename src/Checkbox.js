import React from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient, editData, fetchCheckboxesData, fetchTimestampData } from './util/http'

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
		queryFn: fetchCheckboxesData,
	})

	const { data: timestampData } = useQuery({
		queryKey: ['timestamp'],
		queryFn: fetchTimestampData,
	})

	const handleCheckboxChange = async event => {
		const isChecked = event.target.checked
		mutateCheckbox({ path: 'checkboxes', id: id, data: isChecked })
		mutateTimestamp({ path: 'clickTimes', id: id, data: Date.now() })
	}

	const check24Hours = () => {
		if (timestampData[id] ?? false) {
			const now = new Date()
			const clickDate = new Date(timestampData[id])
			clickDate.setDate(clickDate.getDate() + 3)
			if (now >= clickDate) {
				mutateCheckbox({ path: 'checkboxes', id: id, data: false })
			}
		}
	}

	let content = ''
	if (checkboxesData && timestampData) {
		check24Hours()
		content = (
			<div className='absolute top-3 right-9'>
				<input
					className='h-5 w-5 absolute cursor-pointer accent-pink-500'
					type='checkbox'
					id={id}
					checked={checkboxesData[id]}
					onChange={handleCheckboxChange}
				/>
			</div>
		)
	}

	return <>{content}</>
}

export default Checkbox
