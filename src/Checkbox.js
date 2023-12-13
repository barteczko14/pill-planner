import React, { useState, useEffect, useRef } from 'react'

const Checkbox = ({ id }) => {
	const [checked, setChecked] = useState(false)
	const [clickTime, setClickTime] = useState(null)
	const CHECKBOXES_API = `https://pill-planner-default-rtdb.firebaseio.com/checkboxes/${id}.json`
	const CLICK_TIMES_API = `https://pill-planner-default-rtdb.firebaseio.com/clickTimes/${id}.json`
	const checkboxRef = useRef(CHECKBOXES_API)
	const clickTimeRef = useRef(CLICK_TIMES_API)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const checkboxResponse = await fetch(checkboxRef.current)
				const clickTimeResponse = await fetch(clickTimeRef.current)

				if (!checkboxResponse.ok || !clickTimeResponse.ok) {
					throw new Error('Błąd pobierania danych')
				}

				const isChecked = await checkboxResponse.json()
				const time = await clickTimeResponse.json()

				setChecked(isChecked)
				setClickTime(time)
			} catch (error) {
				console.error('Błąd pobierania danych:', error.message)
			}
		}

		fetchData()

		return () => {}
	}, [id, checkboxRef, clickTimeRef])

	useEffect(() => {
		const check24Hours = async () => {
			if (clickTime) {
				try {
					const now = new Date()
					const clickDate = new Date(clickTime)
					clickDate.setDate(clickDate.getDate() + 3)

					if (now >= clickDate) {
						setChecked(false)
						await fetch(checkboxRef.current, {
							method: 'PUT',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify(false),
						})
					}
				} catch (error) {
					console.error('Błąd podczas aktualizacji danych:', error.message)
				}
			}
		}

		const interval = setInterval(check24Hours, 10000)

		return () => {
			clearInterval(interval)
		}
	}, [checkboxRef, clickTime])

	const handleCheckboxChange = async event => {
		const isChecked = event.target.checked

		try {
			await fetch(checkboxRef.current, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(isChecked),
			})

			await fetch(clickTimeRef.current, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(Date.now()),
			})

			setChecked(isChecked)
		} catch (error) {
			console.error('Błąd podczas aktualizacji danych:', error.message)
		}
	}

	return (
		<div className='absolute top-3 right-9'>
			<input
				className='h-5 w-5 absolute cursor-pointer accent-pink-500'
				type='checkbox'
				id={id}
				checked={checked}
				onChange={handleCheckboxChange}
			/>
		</div>
	)
}

export default Checkbox
