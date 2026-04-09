import React from 'react'
import { motion } from 'framer-motion'

const Form = ({
	date,
	setValueHandler,
	chartData,
	updateData,
	deleteDataHandler,
	setDataToDeleteHandler,
	value,
	setDateHandler,
	dateToDelete,
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, type: 'spring' }}
			className='max-w-4xl mx-auto px-4 pb-20'
		>
			<div className='bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden'>
				{/* Nagłówek panelu */}
				<div className='bg-pink-500 p-6 text-white'>
					<h3 className='text-lg font-black uppercase tracking-widest text-center'>
						Zarządzaj danymi
					</h3>
				</div>

				<div className='p-8 md:p-12 space-y-8'>
					{/* Grid dla inputów - na desktopie obok siebie, na mobile pod sobą */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
						
						{/* Pole: Data */}
						<div className='flex flex-col gap-2'>
							<label htmlFor='date' className='text-xs font-black text-gray-400 uppercase tracking-wider ml-2'>
								Data badania
							</label>
							<input
								onChange={e => setDateHandler(e.target.value)}
								id='date'
								type='date'
								value={date}
								className='w-full bg-gray-50 border-2 border-transparent focus:border-pink-300 focus:bg-white rounded-2xl p-4 outline-none transition-all font-medium text-gray-800'
							/>
						</div>

						{/* Pole: INR */}
						<div className='flex flex-col gap-2'>
							<label htmlFor='inr' className='text-xs font-black text-gray-400 uppercase tracking-wider ml-2'>
								Wynik INR
							</label>
							<input
								id='inr'
								type='number'
								step='0.1'
								value={value}
								onChange={e => setValueHandler(e.target.value.replace(',', '.'))}
								placeholder='np. 2.5'
								className='w-full bg-gray-50 border-2 border-transparent focus:border-pink-300 focus:bg-white rounded-2xl p-4 outline-none transition-all font-medium text-gray-800'
							/>
						</div>
					</div>

					{/* Sekcja usuwania - oddzielona wizualnie */}
					<div className='pt-8 border-t border-gray-100 flex flex-col gap-2'>
						<label className='text-xs font-black text-gray-400 uppercase tracking-wider ml-2'>
							Usuń stary wpis
						</label>
						<select
							className='w-full bg-gray-50 border-2 border-transparent focus:border-red-200 rounded-2xl p-4 outline-none transition-all font-medium text-gray-800 appearance-none'
							value={dateToDelete}
							onChange={e => setDataToDeleteHandler(e.target.value)}
						>
							<option value=''>Wybierz datę z listy...</option>
							{Object.keys(chartData).map(date => (
								<option key={date} value={date}>
									{date}
								</option>
							))}
						</select>
					</div>

					{/* Przyciski akcji */}
					<div className='flex flex-col sm:flex-row gap-4 pt-4'>
						<button
							type='button'
							onClick={updateData}
							className='flex-1 bg-pink-500 text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-[0_10px_20px_rgba(236,72,153,0.3)] hover:bg-pink-600 transition-all active:scale-95'
						>
							Dodaj wynik
						</button>
						
						<button
							type='button'
							onClick={deleteDataHandler}
							className='flex-1 bg-white text-gray-400 font-bold uppercase tracking-widest py-5 rounded-2xl border-2 border-gray-100 hover:border-red-200 hover:text-red-500 transition-all active:scale-95'
						>
							Usuń zaznaczone
						</button>
					</div>
				</div>
			</div>
		</motion.div>
	)
}

export default Form
