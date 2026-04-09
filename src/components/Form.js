import React from 'react'
import { motion } from 'framer-motion'

const Form = ({ date, setValueHandler, updateData, value, setDateHandler }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className='bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden mb-10'
		>
			<div className='bg-pink-500 p-4 text-white text-center text-xs font-black uppercase tracking-widest'>
				Nowe badanie
			</div>

			<div className='p-6 md:p-10 space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div className='flex flex-col gap-2'>
						<label className='text-[10px] font-black text-gray-400 uppercase tracking-wider ml-2'>Data</label>
						<input
							onChange={e => setDateHandler(e.target.value)}
							type='date'
							value={date}
							className='w-full bg-gray-50 border-2 border-transparent focus:border-pink-300 rounded-2xl p-3 outline-none transition-all font-medium text-gray-800'
						/>
					</div>
					<div className='flex flex-col gap-2'>
						<label className='text-[10px] font-black text-gray-400 uppercase tracking-wider ml-2'>Wynik INR</label>
						<input
							type='number'
							step='0.1'
							value={value}
							onChange={e => setValueHandler(e.target.value.replace(',', '.'))}
							placeholder='np. 2.5'
							className='w-full bg-gray-50 border-2 border-transparent focus:border-pink-300 rounded-2xl p-3 outline-none transition-all font-medium text-gray-800'
						/>
					</div>
				</div>

				<button
					type='button'
					onClick={updateData}
					className='w-full bg-pink-500 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-lg hover:bg-pink-600 transition-all active:scale-95'
				>
					Dodaj wynik
				</button>
			</div>
		</motion.div>
	)
}

export default Form
