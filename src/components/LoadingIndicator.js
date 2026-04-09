import React from 'react'

const LoadingIndicator = () => {
	return (
		<div className='flex flex-col items-center justify-center p-20 w-full min-h-[200px]'>
			<div className='relative flex items-center justify-center'>
				{/* Statyczny pierścień w tle (jasny róż) */}
				<div className='w-14 h-14 rounded-full border-4 border-pink-50'></div>
				
				{/* Animowany, kręcący się pierścień (Twój róż) */}
				<div className='absolute w-14 h-14 rounded-full border-4 border-transparent border-t-pink-500 animate-spin'></div>
				
				{/* Kropka w środku dla lepszego efektu wizualnego */}
				<div className='absolute w-2 h-2 bg-pink-200 rounded-full'></div>
			</div>

			{/* Pulsujący tekst pod spodem */}
			<p className='mt-6 text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse'>
				Ładowanie danych
			</p>
		</div>
	)
}

export default LoadingIndicator
