import React, { useState } from 'react'
import Button from './Button'
import Checkbox from './Checkbox'
import { useMutation } from '@tanstack/react-query'
import { queryClient, editData } from '../util/http'
import ErrorBlock from './ErrorBlock'
import { motion } from 'framer-motion'

const Counter = ({ counterData, day }) => {
	const [count, setCount] = useState(counterData)
	const { mutate, isError } = useMutation({
		mutationFn: editData,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['counters'] })
		},
	})

	const increment = () => {
		const newCount = count + 1
		setCount(newCount)
		mutate({ path: 'counters', id: day, data: newCount })
	}

	const decrement = () => {
		const newCount = count - 1
		setCount(newCount)
		mutate({ path: 'counters', id: day, data: newCount })
	}
	let content

	if (isError) {
		content = <ErrorBlock title='Błąd' message='Nie udało się załadować danych' />
	} else {
		content = (
			<motion.div
				variants={{ hidden: { opacity: 0, scale: 0.5 }, show: { opacity: 1, scale: 1 } }}
				className='w-10/12 sm:w-60 relative flex flex-col bg-gradient-to-r from-[#f8c8e0] to-[#f888c0] shadow-lg items-center m-2 rounded-lg border border-[#ec4899]'>
				<h1 className='text-lg'>{day}</h1>
				<Checkbox id={day} />
				<p className='font-medium text-lg'>{count} mg</p>
				<div className='flex'>
					<Button onClick={decrement}>-</Button>
					<Button onClick={increment}>+</Button>
				</div>
			</motion.div>
		)
	}
	return <>{content}</>
}

export default Counter
