const Button = ({ children, ...props }) => {
	return (
		<button
			{...props}
			className='flex items-center justify-center m-2.5 rounded-lg cursor-pointer py-1.5 px-3 bg-[#ec4899] text-white hover:bg-[#f082ac] transition duration-200'>
			{children}
		</button>
	)
}

export default Button
