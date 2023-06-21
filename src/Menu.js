import classes from './Menu.module.css'
const Menu = props => {
	return (
		<div className={classes.menu}>
			<div className={classes.icon}>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='icon icon-tabler icon-tabler-sum'
					width='24'
					height='24'
					viewBox='0 0 24 24'
					strokeWidth='1'
					stroke='currentColor'
					fill='none'
					strokeLinecap='round'
					strokeLinejoin='round'>
					<path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
					<path d='M18 16v2a1 1 0 0 1 -1 1h-11l6 -7l-6 -7h11a1 1 0 0 1 1 1v2'></path>
				</svg>
				{props.sum} mg
			</div>
			<div className={classes.icon}>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='icon icon-tabler icon-tabler-weight'
					width='24'
					height='24'
					viewBox='0 0 24 24'
					strokeWidth='1'
					stroke='currentColor'
					fill='none'
					strokeLinecap='round'
					strokeLinejoin='round'>
					<path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
					<path d='M12 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0'></path>
					<path d='M6.835 9h10.33a1 1 0 0 1 .984 .821l1.637 9a1 1 0 0 1 -.984 1.179h-13.604a1 1 0 0 1 -.984 -1.179l1.637 -9a1 1 0 0 1 .984 -.821z'></path>
				</svg>
				{props.average} mg
			</div>
		</div>
	)
}
export default Menu
