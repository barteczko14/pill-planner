import React, { useState } from 'react'
import Button from './Button' // Zakładam, że ostylujemy go w następnym kroku
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
		if (count <= 0) return // Zabezpieczenie przed dawką ujemną
		const newCount = count - 1
		setCount(newCount)
		mutate({ path: 'counters', id: day, data: newCount })
	}

	if (isError) {
		return <ErrorBlock title='Błąd' message='Nie udało się zapisać zmian' />
	}

	return (
		<motion.div
			variants={{ 
				hidden: { opacity: 0, y: 20 }, 
				show: { opacity: 1, y: 0 } 
			}}
			initial="hidden"
			animate="show"
			className='w-full sm:w-64 relative flex flex-col bg-white shadow-sm border border-pink-50 items-center p-6 rounded-[2.5rem] transition-all hover:shadow-md'
		>
			{/* Checkbox w rogu (korzysta z Twojego nowego Checkbox.js) */}
			<Checkbox id={day} />

			{/* Nazwa dnia */}
			<h2 className='text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-4'>
				{day}
			</h2>

			{/* Wyświetlacz dawki */}
			<div className='flex items-baseline gap-1 mb-6'>
				<span className='text-4xl font-black text-gray-800'>{count}</span>
				<span className='text-pink-500 font-bold'>mg</span>
			</div>

			{/* Przyciski sterowania - duże i klikalne na mobile */}
			<div className='flex items-center gap-6'>
				<button 
					onClick={decrement}
					className='w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 text-2xl font-light hover:bg-pink-50 hover:text-pink-500 transition-colors active:scale-90'
				>
					−
				</button>
				
				<button 
					onClick={increment}
					className='w-12 h-12 flex items-center justify-center rounded-2xl bg-pink-500 text-white text-2xl font-light shadow-[0_10px_20px_rgba(236,72,153,0.3)] hover:bg-pink-600 transition-all active:scale-90'
				>
					+
				</button>
			</div>
		</motion.div>
	)
}

export default Counter
