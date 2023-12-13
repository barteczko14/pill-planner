export default function ErrorBlock({ title, message }) {
	return (
		<div className='flex items-center bg-[#f0d9e5] text-[#890b35] text-left gap-8 my-2 p-2 rounded'>
			<div className='flex items-center bg-[#890b35] text-white justify-center rounded-full w-12 h-12 text-3xl'>!</div>
			<div className=''>
				<h2 className='m-0 text-inherit text-2xl'>{title}</h2>
				<p className='m-0'>{message}</p>
			</div>
		</div>
	)
}
