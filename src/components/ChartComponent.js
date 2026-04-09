import React, { useState, useMemo } from 'react'
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
		if (!date || !value) return alert('Wpisz datę i wartość!')
		
		const sanitizedDate = date.replace(/[.#$/[\]]/g, '_')
		const newData = {
			...(data || {}), 
			[sanitizedDate]: value,
		}
		addMutate(newData)
		setDate('')
		setValue('')
	}

	const deleteDataHandler = () => {
		if (!dateToDelete) return alert('Wybierz datę do usunięcia!')
		deleteMutate(dateToDelete)
		setDateToDelete('')
	}

	const chartOptions = useMemo(() => {
		return {
			chart: {
				id: 'chart',
				type: 'line',
				toolbar: { show: false },
				fontFamily: 'Inter, sans-serif',
				dropShadow: { enabled: true, top: 8, blur: 10, opacity: 0.1, color: '#ea4c89' },
				locales: [{
					name: 'pl',
					options: {
						months: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
						shortMonths: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
						days: ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'],
						shortDays: ['Ndz', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob'],
					}
				}],
				defaultLocale: 'pl'
			},
			stroke: { curve: 'smooth', width: 4 },
			// PRZYWRÓCONE MARKERY (PUNKTY)
			markers: {
				size: 5,
				colors: ['#ffffff'],
				strokeColors: '#ea4c89',
				strokeWidth: 3,
				hover: { size: 7 }
			},
			xaxis: { 
				type: 'datetime',
				labels: { style: { colors: '#94a3b8' } }
			},
			colors: ['#ea4c89'],
			yaxis: { 
				min: 0.5, 
				max: 4,
				labels: { style: { colors: '#94a3b8' } }
			},
			grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
			// PRZYWRÓCONE I WZMOCNIONE PASMO NORMY
			annotations: {
				yaxis: [{
					y: 2.0,
					y2: 3.5,
					borderColor: 'transparent',
					fillColor: '#ea4c89',
					opacity: 0.25, // Mocniejszy róż, żeby był widoczny
					label: {
						text: 'NORMA',
						position: 'left',
						style: { color: '#ea4c89', background: '#fff', fontWeight: 900 }
					}
				}],
			},
			tooltip: { theme: 'light' }
		}
	}, [])

	const series = useMemo(() => {
		if (!data) return []
		return [{
			name: 'Poziom INR',
			data: Object.entries(data).map(([date, value]) => ({
				x: new Date(date).getTime(),
				y: Number(value),
			})).sort((a, b) => a.x - b.x),
		}]
	}, [data])

	if (isPending) return <LoadingIndicator />
	if (isError) return <ErrorBlock title='Błąd' message='Nie udało się załadować danych' />

	const hasData = data && Object.keys(data).length > 0

	return (
		<div className='max-w-4xl mx-auto px-4'>
			{hasData ? (
				<div className='bg-white rounded-[2rem] p-4 md:p-8 shadow-sm border border-pink-50 my-6'>
					<div className='flex items-center justify-between mb-6 px-2'>
						<h2 className='text-lg font-bold text-gray-800 uppercase tracking-wider'>Historia wyników</h2>
					</div>
					<div className='w-full'>
						<ApexCharts 
							options={chartOptions} 
							series={series} 
							type='line' 
							height={window.innerWidth < 640 ? 250 : 350} 
						/>
					</div>
				</div>
			) : (
				/* Stan pusty z instrukcją */
				<div className='bg-white rounded-[2rem] p-10 shadow-sm border-2 border-dashed border-pink-100 my-6 text-center transition-all'>
					<div className='text-4xl mb-4'>📈</div>
					<p className='text-gray-400 font-medium'>
						Twoja historia jest pusta. <br/> Dodaj pierwszy wynik INR w formularzu poniżej!
					</p>
				</div>
			)}

			<Form
				date={date}
				setValueHandler={setValue}
				chartData={data || {}} 
				updateData={updateData}
				deleteDataHandler={deleteDataHandler}
				setDataToDeleteHandler={setDateToDelete}
				value={value}
				setDateHandler={setDate}
				dateToDelete={dateToDelete}
			/>
		</div>
	)
}

export default ChartComponent
