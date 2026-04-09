import React from 'react'
import { motion } from 'framer-motion'

export default function ErrorBlock({ title, message }) {
	return (
		<motion.div 
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			className='flex items-center bg-red-50 text-red-900 text-left gap-4 md:gap-6 my-6 p-4 md:p-6 rounded-[2rem] border border-red-100 max-w-4xl mx-auto'
		>
			{/* Ikona błędu - nowoczesne kółko */}
			<div className='flex-shrink-0 flex items-center bg-red-600 text-white justify-center rounded-2xl w-12 h-12 text-xl font-black shadow-[0_8px_16px_rgba(220,38,38,0.2)]'>
				!
			</div>

			<div className='flex flex-col'>
				<h2 className='m-0 text-red-600 text-lg md:text-xl font-black uppercase tracking-tight'>
					{title}
				</h2>
				<p className='m-0 text-red-800/80 text-sm md:text-base font-medium'>
					{message}
				</p>
			</div>
		</motion.div>
	)
}
