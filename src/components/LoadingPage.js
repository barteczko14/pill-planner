import React from 'react'
import logo from '../assets/img/pill.png'
import { motion } from 'framer-motion'

const LoadingPage = () => {
	return (
		<div className='flex flex-col justify-center items-center w-screen h-screen bg-white'>
			<div className='relative'>
				{/* Subtelna poświata za logo */}
				<div className='absolute inset-0 bg-pink-200 blur-3xl opacity-20 rounded-full'></div>
				
				<motion.img 
					// Animacja "oddychania" logotypu
					animate={{ 
						scale: [1, 1.1, 1],
						opacity: [0.8, 1, 0.8] 
					}}
					transition={{ 
						duration: 2, 
						repeat: Infinity, 
						ease: "easeInOut" 
					}}
					className='relative w-24 lg:w-32 z-10' 
					src={logo} 
					alt="Pill Planner Logo" // Naprawiony błąd alt dla Netlify
				/>
			</div>

			{/* Napis pod logo */}
			<motion.div 
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5 }}
				className='mt-8 flex flex-col items-center'
			>
				<h1 className='text-gray-800 font-black uppercase tracking-[0.4em] text-xs'>
					Pill Planner
				</h1>
				<div className='mt-2 w-12 h-1 bg-pink-500 rounded-full overflow-hidden'>
					<motion.div 
						animate={{ x: [-50, 50] }}
						transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
						className='w-full h-full bg-pink-300'
					/>
				</div>
			</motion.div>
		</div>
	)
}

export default LoadingPage
