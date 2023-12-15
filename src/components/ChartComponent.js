import React, { useState } from 'react'
import ApexCharts from 'react-apexcharts'
import { fetchData, addData, deleteData, queryClient } from '../util/http'
import { useQuery, useMutation } from '@tanstack/react-query'
import ErrorBlock from './ErrorBlock'
import LoadingIndicator from './LoadingIndicator'
import Form from './Form'

const ChartComponent = () => {
	const [date, setDate] = useState('')
	const [value, setValue] = useState('')
	const [dateToDelete, setDateToDelete] = useState('')
	const { data, isPending, isError } = useQuery({
		queryKey: ['chart'],
		queryFn: ({ signal }) => fetchData({ signal, path: 'chartData' }),
	})

	const { mutate: addMutate } = useMutation({
		mutationFn: addData,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['chart'] })
		},
	})

	const { mutate: deleteMutate } = useMutation({
		mutationFn: deleteData,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['chart'] })
		},
	})

	const updateData = () => {
		const sanitizedDate = date.replace(/[.#$\/\[\]]/g, '_')
		const newData = {
			...data,
			[sanitizedDate]: value,
		}

		addMutate(newData)
		setDate('')
		setValue('')
	}

	const deleteDataHandler = () => {
		deleteMutate(dateToDelete)
		setDateToDelete('')
	}

	const setDataToDeleteHandler = data => {
		setDateToDelete(data)
	}

	const setValueHandler = value => {
		setValue(value)
	}
	const setDateHandler = value => {
		setDate(value)
	}

	let content = ''

	if (isPending) {
		content = <LoadingIndicator />
	}

	if (isError) {
		content = <ErrorBlock title='Błąd' message='Nie udało się załadować danych' />
	}
	if (data) {
		const chartOptions = {
			chart: {
				defaultLocale: 'en',
				locales: [
					{
						name: 'en',
						options: {
							months: [
								'Styczeń',
								'Luty',
								'Marzec',
								'Kwiecień',
								'Maj',
								'Czerwiec',
								'Lipiec',
								'Sierpień',
								'Wrzesień',
								'Październik',
								'Listopad',
								'Grudzień',
							],
							shortMonths: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
							days: ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'],
							shortDays: ['Ndz', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob'],
							toolbar: {
								download: 'Pobierz SVG',
								selection: 'Zaznaczenie',
								selectionZoom: 'Powiększenie zaznaczenia',
								zoomIn: 'Powiększ',
								zoomOut: 'Pomniejsz',
								pan: 'Przesuwanie',
								reset: 'Resetuj powiększenie',
							},
						},
					},
				],
				id: 'chart',
				type: 'line',
				height: 300,
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
					name: 'INR',
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
						borderColor: 'rgb(234, 76, 137)',
						fillColor: 'rgba(234, 76, 137, 0.2)',
					},
				],
			},
			yaxis: {
				min: 0.5,
				max: 4,
			},
		}
		content = (
			<>
				<div className='sm-2 lg:m-10'>
					<ApexCharts options={chartOptions} series={chartOptions.series} type='line' height={350} />
				</div>
				<Form
					date={date}
					setValueHandler={setValueHandler}
					chartData={data}
					updateData={updateData}
					deleteDataHandler={deleteDataHandler}
					setDataToDeleteHandler={setDataToDeleteHandler}
					value={value}
					setDateHandler={setDateHandler}
					dateToDelete={dateToDelete}></Form>
			</>
		)
	}

	return <>{content}</>
}

export default ChartComponent
