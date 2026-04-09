import React from 'react'

const Menu = ({ counterData }) => {
	// Obliczanie sumy
	const sum = Object.values(counterData).reduce((accumulator, value) => accumulator + value, 0)
	// Obliczanie średniej
	const average = (sum / 7).toFixed(2)

	return (
		<div className='grid grid-cols-2 gap-4 px-4 py-6 max-w-4xl mx-auto'>
			{/* Karta: Suma */}
			<div className='bg-white rounded-3xl p-5 shadow-sm border border-pink-50 flex flex-col items-center justify-center transition-transform active:scale-95'>
				<span className='text-gray-400 text-xs uppercase tracking-wider font-bold mb-1'>
					Suma tygodniowa
				</span>
				<div className='flex items-baseline gap-1'>
					<span className='text-2xl font-black text-gray-800'>{sum}</span>
					<span className='text-pink-500 font-bold text-sm'>mg</span>
				</div>
			</div>

			{/* Karta: Średnia */}
			<div className='bg-white rounded-3xl p-5 shadow-sm border border-pink-50 flex flex-col items-center justify-center transition-transform active:scale-95'>
				<span className='text-gray-400 text-xs uppercase tracking-wider font-bold mb-1'>
					Średnia dzienną
				</span>
				<div className='flex items-baseline gap-1'>
					<span className='text-2xl font-black text-gray-800'>{average}</span>
					<span className='text-pink-500 font-bold text-sm'>mg</span>
				</div>
			</div>
		</div>
	)
}

export default Menu
