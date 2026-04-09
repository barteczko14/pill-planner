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

	const { data, isPending, isError } = useQuery({
		queryKey: ['chart'],
		queryFn: ({ signal }) => fetchData({ signal, path: 'chartData' }),
	})

	const { mutate: addMutate } = useMutation({
		mutationFn: addData,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['chart'] }),
	})

	const { mutate: deleteMutate } = useMutation({
		mutationFn: deleteData,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['chart'] }),
	})

	const updateData = () => {
		if (!date || !value) return alert('Uzupełnij datę i wynik!')
		const sanitizedDate = date.replace(/[.#$/[\]]/g, '_')
		const newData = { ...(data || {}), [sanitizedDate]: value }
		addMutate(newData)
		setDate(''); setValue('')
	}

	// NOWA FUNKCJA USUWANIA - przyjmuje konkretną datę
	const removeEntry = (dateKey) => {
		if (window.confirm(`Czy na pewno usunąć wynik z dnia ${dateKey}?`)) {
			deleteMutate(dateKey)
		}
	}

	const chartOptions = useMemo(() => ({
		chart: {
			id: 'chart',
			type: 'line',
			toolbar: { show: false },
			fontFamily: 'Inter, sans-serif',
			dropShadow: { enabled: true, top: 8, blur: 10, opacity: 0.1, color: '#ea4c89' },
		},
		stroke: { curve: 'smooth', width: 4 },
		markers: { size: 5, colors: ['#ffffff'], strokeColors: '#ea4c89', strokeWidth: 3 },
		xaxis: { type: 'datetime', labels: { style: { colors: '#94a3b8' } } },
		colors: ['#ea4c89'],
		yaxis: { min: 0.5, max: 4, labels: { style: { colors: '#94a3b8' } } },
		grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
		annotations: {
			yaxis: [{
				y: 2.0, y2: 3.5, borderColor: 'transparent', fillColor: '#ea4c89', opacity: 0.2,
				label: { text: 'NORMA', style: { color: '#ea4c89', background: '#fff', fontWeight: 900 } }
			}],
		},
	}), [])

	const series = useMemo(() => {
		if (!data) return []
		return [{
			name: 'Poziom INR',
			data: Object.entries(data).map(([d, v]) => ({ x: new Date(d).getTime(), y: Number(v) })).sort((a, b) => a.x - b.x),
		}]
	}, [data])

	if (isPending) return <LoadingIndicator />
	if (isError) return <ErrorBlock title='Błąd' message='Nie udało się załadować danych' />

	const sortedEntries = data 
		? Object.entries(data).sort((a, b) => new Date(b[0]) - new Date(a[0])) 
		: []

	return (
		<div className='max-w-4xl mx-auto px-4'>
			{/* Formularz na górze */}
			<Form date={date} setValueHandler={setValue} updateData={updateData} value={value} setDateHandler={setDate} />

			{/* Wykres */}
			{sortedEntries.length > 0 && (
				<div className='bg-white rounded-[2rem] p-4 md:p-8 shadow-sm border border-pink-50 my-6'>
					<ApexCharts options={chartOptions} series={series} type='line' height={300} />
				</div>
			)}

			{/* NOWA SEKCJA: LISTA HISTORII */}
			<div className='mt-10'>
				<h3 className='text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 ml-4'>Historia wpisów</h3>
				<div className='space-y-3'>
					{sortedEntries.map(([dateKey, val]) => (
						<div key={dateKey} className='bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex justify-between items-center transition-all hover:border-pink-100'>
							<div className='flex flex-col'>
								<span className='text-xs font-bold text-gray-800'>{dateKey}</span>
								<span className='text-[10px] text-gray-400 uppercase'>Data badania</span>
							</div>
							<div className='flex items-center gap-6'>
								<div className='text-right'>
									<span className='text-lg font-black text-pink-500'>{val}</span>
									<span className='text-[10px] ml-1 text-pink-300 font-bold'>INR</span>
								</div>
								{/* Przycisk usuwania dla konkretnego wpisu */}
								<button 
									onClick={() => removeEntry(dateKey)}
									className='w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all active:scale-90'
								>
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
									</svg>
								</button>
							</div>
						</div>
					))}
					{sortedEntries.length === 0 && (
						<p className='text-center text-gray-400 text-sm py-10'>Brak wpisów w historii.</p>
					)}
				</div>
			</div>
		</div>
	)
}

export default ChartComponent
