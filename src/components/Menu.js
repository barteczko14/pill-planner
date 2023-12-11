const Menu = ({ sum, average }) => {
	return (
		<div className='flex justify-around m-4 p-4 font-medium'>
			<p>{`Suma: ${sum} (mg)`}</p>
			<p>{`Średnia: ${average} (mg)`}</p>
		</div>
	)
}
export default Menu
