import React, { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get } from 'firebase/database'
import ApexCharts from 'react-apexcharts'
import Button from './Button'
import classes from './ChartComponent.module.css'
import firebaseConfig from './firebaseConfig'

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

const ChartComponent = () => {
	const [data, setData] = useState({})
	const [date, setDate] = useState('')
	const [value, setValue] = useState('')
	const [dateToDelete, setDateToDelete] = useState('')

	useEffect(() => {
		const fetchData = async () => {
			const snapshot = await get(ref(database, '/chartData'))
			const chartData = snapshot.val() || {}
			setData(chartData)
		}
		fetchData()
	}, [])

	const updateData = () => {
		const sanitizedDate = date.replace(/[.#$\/\[\]]/g, '_')

		set(ref(database, '/chartData'), {
			...data,
			[sanitizedDate]: value,
		})

		setData({
			...data,
			[sanitizedDate]: value,
		})

		setDate('')
		setValue('')
	}

	const deleteData = () => {
		const updatedData = { ...data }
		delete updatedData[dateToDelete]
		set(ref(database, '/chartData'), updatedData)
		setData(updatedData)
		setDateToDelete('')
	}

	const chartOptions = {
		chart: {
			id: 'chart',
			type: 'line',
			height: 350,
			animations: {
				enabled: true,
				easing: 'linear',
				dynamicAnimation: {
					speed: 1000,
				},
			},
			toolbar: {
				show: false,
			},
		},
		xaxis: {
			type: 'datetime',
		},
		series: [
			{
				name: 'Value',
				data: Object.entries(data).map(([date, value]) => ({
					x: new Date(date).getTime(),
					y: Number(value),
				})),
			},
		],
		colors: ['rgb(234, 76, 137)'],
		annotations: {
			yaxis: [
				{
					y: 2.0,
					y2: 3.5,
				},
			],
		},
		yaxis: {
			min: 0,
			max: 4,
		},
	}

	return (
		<div>
			<ApexCharts options={chartOptions} series={chartOptions.series} type='line' height={350} />
			<div className={classes.form}>
				<div className={classes.formGroup}>
					<input
						type='date'
						placeholder='Data'
						className={classes.formInput}
						value={date}
						id='callendar'
						onChange={e => setDate(e.target.value)}
					/>
				</div>
				<label htmlFor='callendar' className={classes.formLabel}>
					Data
				</label>
				<div className={classes.formGroup}>
					<input
						type='text'
						placeholder='INR'
						className={classes.formInput}
						id='inr'
						value={value}
						onChange={e => setValue((e.target.value).replace(',', '.'))}
					/>
					<label htmlFor='inr' className={classes.formLabel}>
						INR
					</label>
				</div>

				<select className={classes.customSelect} value={dateToDelete} onChange={e => setDateToDelete(e.target.value)}>
					<option value=''>Wybierz datę do usunięcia</option>
					{Object.keys(data).map(date => (
						<option key={date} value={date}>
							{date}
						</option>
					))}
				</select>
				<div className={classes.buttonsContainer}>
					<Button onClick={updateData} btnText='Dodaj'></Button>
					<Button onClick={deleteData} btnText='Usuń dane'></Button>
				</div>
			</div>
		</div>
	)
}

export default ChartComponent
