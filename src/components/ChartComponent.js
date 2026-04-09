import React, { useState, useMemo } from 'react' // Dodano useMemo
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
		// NAPRAWIONY REGEX: Usunięte zbędne backslashe
		const sanitizedDate = date.replace(/[.#$/[\]]/g, '_')
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

	// Memonizacja opcji wykresu - zapobiega mruganiu wykresu przy wpisywaniu w Form
	const chartOptions = useMemo(() => {
		if (!data) return null;

		return {
			chart: {
				id: 'chart',
				type: 'line',
				height: 300,
				animations: {
					enabled: true,
					easing: 'linear',
					dynamicAnimation: { speed: 1000 },
				},
				toolbar: { show: false },
				locales: [{
					name: 'pl', // Zmieniono na 'pl'
					options: {
						months: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
						shortMonths: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
						days: ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'],
						shortDays: ['Ndz', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob'],
					}
				}],
				defaultLocale: 'pl'
			},
			xaxis: { type: 'datetime' },
			colors: ['rgb(234, 76, 137)'],
			annotations: {
				yaxis: [{
					y: 2.0,
					y2: 3.5,
					borderColor: 'rgb(234, 76, 137)',
					fillColor: 'rgba(234, 76, 137, 0.2)',
				}],
			},
			yaxis: { min: 0.5, max: 4 },
		};
	}, [data]);

	const series = useMemo(() => {
		if (!data) return [];
		return [{
			name: 'INR',
			data: Object.entries(data).map(([date, value]) => ({
				x: new Date(date).getTime(),
				y: Number(value),
			})),
		}];
	}, [data]);

	if (isPending) return <LoadingIndicator />;
	if (isError) return <ErrorBlock title='Błąd' message='Nie udało się załadować danych' />;
	if (!data) return null;

	return (
		<>
			<div className='sm-2 lg:m-10'>
				<ApexCharts options={chartOptions} series={series} type='line' height={350} />
			</div>
			<Form
				date={date}
				setValueHandler={setValue}
				chartData={data}
				updateData={updateData}
				deleteDataHandler={deleteDataHandler}
				setDataToDeleteHandler={setDateToDelete}
				value={value}
				setDateHandler={setDate}
				dateToDelete={dateToDelete}
			/>
		</>
	);
}

export default ChartComponent;
