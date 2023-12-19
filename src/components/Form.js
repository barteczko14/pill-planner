import React from 'react'
import Button from './Button'
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
			initial={{ y: 300 }}
			animate={{ y: 0 }}
			bounce
			transition={{ duration: 0.5, type: 'spring' }}
			className='py-10 flex flex-col justify-center'>
			<div className='relative py-3 sm:mx-auto'>
				<div className='absolute inset-0 bg-gradient-to-r from-[#f8c8e0] to-[#ec4899] shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl'></div>
				<div className='relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-8'>
					<div className='py-2 text-base space-y-3 text-gray-700 sm:text-lg sm:leading-7'>
						<div className='relative'>
							<input
								onChange={e => setDateHandler(e.target.value)}
								autoComplete='off'
								id='date'
								name='date'
								type='date'
								value={date}
								className='h-10 w-full border-b-2 border-[#f8c8e0] text-gray-900 focus:outline-none'
							/>
							<label htmlFor='date' className='absolute left-0 -top-3.5 text-gray-600 text-base'>
								Data
							</label>
						</div>
						<div className='relative'>
							<input
								autoComplete='off'
								id='inr'
								name='inr'
								type='number'
								value={value}
								onChange={e => setValueHandler(e.target.value.replace(',', '.'))}
								className='peer placeholder-transparent h-10 w-full border-b-2 border-[#f8c8e0] text-gray-900 focus:outline-none'
								placeholder='INR'
							/>
							<label
								htmlFor='inr'
								className='absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm'>
								INR
							</label>
						</div>
						<div className='relative'>
							<select
								className='peer placeholder-transparent h-10 w-full border-b-2 border-[#f8c8e0] text-gray-900 focus:outline-none'
								value={dateToDelete}
								onChange={e => setDataToDeleteHandler(e.target.value)}>
								<option value=''>Wybierz datę do usunięcia</option>
								{Object.keys(chartData).map(date => (
									<option key={date} value={date}>
										{date}
									</option>
								))}
							</select>
						</div>
						<div className='flex justify-between items-center'>
							<Button type='button' onClick={updateData}>
								Dodaj
							</Button>
							<Button type='button' onClick={deleteDataHandler}>
								Usuń dane
							</Button>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	)
}

export default Form
