import React from 'react'

const Menu = ({ counterData }) => {
	const sum = Object.values(counterData).reduce((accumulator, value) => accumulator + value, 0)

	return (
		<div className='flex justify-around m-4 p-4 font-medium'>
			<p>{`Suma: ${sum} (mg)`}</p>
			<p>{`Średnia: ${(sum / 7).toFixed(2)} (mg)`}</p>
		</div>
	)
}
export default Menu
