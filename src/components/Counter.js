import React, { useState } from 'react'
import Button from './Button'
import Checkbox from '../Checkbox'

const Counter = ({ children, counterData }) => {
	const [count, setCount] = useState(counterData)

	async function fetchData(path, count) {
		try {
			const response = await fetch(`https://pill-planner-default-rtdb.firebaseio.com/counters/${path}.json`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(count),
			})

			if (!response.ok) {
				throw new Error('Error')
			}
		} catch (error) {
			alert('Błąd dodawania danych!')
		}
	}

	const increment = () => {
		const newCount = count + 1
		setCount(newCount)
		fetchData(children, newCount)
	}

	const decrement = () => {
		const newCount = count - 1
		setCount(newCount)
		fetchData(children, newCount)
	}

	return (
		<div className='w-52 relative flex flex-col bg-[#f8c8e0] items-center m-2 rounded-lg border border-[#ec4899]'>
			<h1 className='text-lg'>{children}</h1>
			<Checkbox id={children} />
			<p className='font-medium text-lg'>{count} mg</p>
			<div className='flex'>
				<Button onClick={decrement}>-</Button>
				<Button onClick={increment}>+</Button>
			</div>
		</div>
	)
}

export default Counter
