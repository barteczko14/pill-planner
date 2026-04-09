import React, { useEffect, useCallback } from 'react'
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
	}, [check24Hours])

	if (!checkboxesData || !timestampData) return null;

	const isChecked = checkboxesData[id] || false;

	return (
		<div className='absolute top-4 right-4'>
			<label className='relative inline-flex items-center cursor-pointer group'>
				<input
					type='checkbox'
					id={id}
					checked={isChecked}
					onChange={handleCheckboxChange}
					className='sr-only peer' // Ukrywamy oryginalny checkbox, używamy peer do stylizacji
				/>
				{/* Własny styl checkboxa (Custom UI) */}
				<div className={`
					w-7 h-7 rounded-xl border-2 transition-all duration-300 flex items-center justify-center
					${isChecked 
						? 'bg-pink-500 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.4)]' 
						: 'bg-white border-gray-200 group-hover:border-pink-300'
					}
				`}>
					{/* Ikonka "ptaszka" (SVG) pojawiająca się po zaznaczeniu */}
					<svg 
						className={`w-4 h-4 text-white transition-opacity duration-300 ${isChecked ? 'opacity-100' : 'opacity-0'}`}
						fill="none" 
						viewBox="0 0 24 24" 
						stroke="currentColor" 
						strokeWidth="4"
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
					</svg>
				</div>
			</label>
		</div>
	)
}

export default Checkbox
