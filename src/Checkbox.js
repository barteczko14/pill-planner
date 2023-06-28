import classes from './Checkbox.module.css'
import React, { useState, useEffect } from 'react'
import firebase from 'firebase/compat/app'
import 'firebase/compat/database'
import firebaseConfig from './firebaseConfig'

firebase.initializeApp(firebaseConfig)

const Checkbox = ({ id, label }) => {
	const [checked, setChecked] = useState(false)
	const [clickTime, setClickTime] = useState(null)
	const checkboxRef = firebase.database().ref(`checkboxes/${id}`)
	const clickTimeRef = firebase.database().ref(`clickTimes/${id}`)

	useEffect(() => {
		checkboxRef.on('value', snapshot => {
			const isChecked = snapshot.val()
			setChecked(isChecked)
		})

		clickTimeRef.on('value', snapshot => {
			const time = snapshot.val()
			setClickTime(time)
		})

		return () => {
			checkboxRef.off()
			clickTimeRef.off()
		}
	}, [id])

	useEffect(() => {
		const check24Hours = () => {
			if (clickTime) {
				const now = new Date()
				const clickDate = new Date(clickTime)
				clickDate.setDate(clickDate.getDate() + 3)
				if (now >= clickDate) {
					setChecked(false)
					checkboxRef.set(false)
				}
			}
		}

		const interval = setInterval(check24Hours, 10000)

		return () => {
			clearInterval(interval)
		}
	}, [checkboxRef, clickTime])

	const handleCheckboxChange = event => {
		const isChecked = event.target.checked
		setChecked(isChecked)
		checkboxRef.set(isChecked)
		clickTimeRef.set(firebase.database.ServerValue.TIMESTAMP)
	}

	return (
		<div className={classes['checkbox-position']}>
			<label className={classes['checkbox-container']}>
				<input
					className={classes.checkmark}
					type='checkbox'
					id={id}
					checked={checked}
					onChange={handleCheckboxChange}
				/>
				{label}
			</label>
		</div>
	)
}

export default Checkbox
