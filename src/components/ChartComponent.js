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
			...(data || {}), // Zabezpieczenie, jeśli data jest null
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
			xaxis: { type: 'datetime' },
			colors: ['#ea4c89'],
			yaxis: { min: 0.5, max: 4 },
			grid: { borderColor: '#f1f5f9', strokeDashArray: 4 }
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

	// Sprawdzamy, czy są jakiekolwiek dane do wyświetlenia na wykresie
	const hasData = data && Object.keys(data).length > 0

	return (
		<div className='max-w-4xl mx-auto px-4'>
			{/* Wykres - renderuj tylko jeśli są dane */}
			{hasData ? (
				<div className='bg-white rounded-[2rem] p-4 md:p-8 shadow-sm border border-pink-50 my-6'>
					<div className='flex items-center justify-between mb-6 px-2'>
						<h2 className='text-lg font-bold text-gray-800'>Historia wyników</h2>
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
				<div className='bg-white rounded-[2rem] p-10 shadow-sm border border-dashed border-pink-200 my-6 text-center text-gray-400 font-medium'>
					Brak danych do wyświetlenia. Dodaj pierwszy wynik poniżej!
				</div>
			)}

			{/* Formularz - TERAZ ZAWSZE WIDOCZNY */}
			<Form
				date={date}
				setValueHandler={setValue}
				chartData={data || {}} // Przekazujemy pusty obiekt zamiast null
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
