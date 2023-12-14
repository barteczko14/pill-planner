import React, { useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set } from 'firebase/database'
import ApexCharts from 'react-apexcharts'
import Button from './components/Button'
import classes from './ChartComponent.module.css'
import firebaseConfig from './firebaseConfig'
import { fetchChartData, addData } from './util/http'
import { useQuery } from '@tanstack/react-query'
import ErrorBlock from './components/ErrorBlock'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from './util/http'

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

const ChartComponent = () => {
	const [date, setDate] = useState('')
	const [value, setValue] = useState('')
	const [dateToDelete, setDateToDelete] = useState('')
	const {
		data: chartData,
		isPending: chartIsPending,
		isError: chartIsError,
	} = useQuery({
		queryKey: ['chart'],
		queryFn: fetchChartData,
	})

	const { mutate, isError } = useMutation({
		mutationFn: addData,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['chart'] })
		},
	})

	const updatedData = { ...chartData }

	const updateData = () => {
		const sanitizedDate = date.replace(/[.#$\/\[\]]/g, '_')
		const newData = {
			...chartData,
			[sanitizedDate]: value,
		}

		mutate(newData)

		setDate('')
		setValue('')
	}

	const deleteData = () => {
		const updatedData = { ...chartData }
		delete updatedData[dateToDelete]
		set(ref(database, '/chartData'), updatedData)

		setDateToDelete('')
	}
	let content = ''

	if (chartIsError) {
		content = <ErrorBlock title='Błąd' message='Nie udało się załadować danych' />
	}
	if (chartData) {
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
					data: Object.entries(chartData).map(([date, value]) => ({
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
		content = (
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
							onChange={e => setValue(e.target.value.replace(',', '.'))}
						/>
						<label htmlFor='inr' className={classes.formLabel}>
							INR
						</label>
					</div>

					<select className={classes.customSelect} value={dateToDelete} onChange={e => setDateToDelete(e.target.value)}>
						<option value=''>Wybierz datę do usunięcia</option>
						{Object.keys(chartData).map(date => (
							<option key={date} value={date}>
								{date}
							</option>
						))}
					</select>
					<div className={classes.buttonsContainer}>
						<Button onClick={updateData}>Dodaj</Button>
						<Button onClick={deleteData}>Usuń dane</Button>
					</div>
				</div>
			</div>
		)
	}

	return <>{content}</>
}

export default ChartComponent
