import React, { useState, useEffect } from 'react'
import Button from './Button'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue, set } from 'firebase/database'
import Checkbox from './Checkbox'
import firebaseConfig from './firebaseConfig'
import classes from './Counter.module.css'

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

const Counter = props => {
	const [count, setCount] = useState(0)

	useEffect(() => {
		const counterRef = ref(database, `counters/${props.counterId}`)
		onValue(counterRef, snapshot => {
			const value = snapshot.val()
			if (value !== null) {
				setCount(value)
			}
		})

		return () => {}
	}, [])

	const increment = () => {
		const newCount = count + 1
		setCount(newCount)
		set(ref(database, `counters/${props.counterId}`), newCount)
	}

	const decrement = () => {
		const newCount = count - 1
		setCount(newCount)
		set(ref(database, `counters/${props.counterId}`), newCount)
	}

	return (
		<div className={classes.card}>
			<h1 className={classes.day}>{props.counterId}</h1>
			<Checkbox id={props.counterId} />
			<p className={classes.count}>{count} mg</p>
			<div className={classes.buttons}>
				<Button onClick={decrement} btnText={'-'}></Button>
				<Button onClick={increment} btnText={'+'}></Button>
			</div>
		</div>
	)
}

export default Counter
