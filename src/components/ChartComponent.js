import React, { useState, useMemo } from 'react'
import ApexCharts from 'react-apexcharts'
import { fetchData, addData, deleteData, queryClient } from '../util/http'
import { useQuery, useMutation } from '@tanstack/react-query'
import ErrorBlock from './ErrorBlock'
import LoadingIndicator from './LoadingIndicator'
import Form from './Form'
import { motion } from 'framer-motion'

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
		setDate('')
		setValue('')
	}

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
			// PEŁNA POLSKA LOKALIZACJA
			locales: [{
				name: 'pl',
				options: {
					months: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
					shortMonths: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
					days: ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'],
					shortDays: ['Ndz', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob'],
					toolbar: {
						download: 'Pobierz',
						selection: 'Wybór',
						zoom: 'Powiększenie',
						zoomIn: 'Powiększ',
						zoomOut: 'Pomniejsz',
						pan: 'Przesuwanie',
						reset: 'Resetuj'
					}
				}
			}],
			defaultLocale: 'pl'
		},
		stroke: { curve: 'smooth', width: 4 },
		markers: { size: 5, colors: ['#ffffff'], strokeColors: '#ea4c89', strokeWidth: 3 },
		xaxis: { 
			type: 'datetime', 
			labels: { 
				style: { colors: '#94a3b8' },
				datetimeFormatter: { year: 'yyyy', month: 'MMM \'yy', day: 'dd MMM', hour: 'HH:mm' }
			} 
		},
		colors: ['#ea4c89'],
		yaxis: { 
			min: 0.5, 
			max: 4, 
			labels: { style: { colors: '#94a3b8' } } 
		},
		grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
		annotations: {
			yaxis: [{
				y: 2.0, y2: 3.5, borderColor: 'transparent', fillColor: '#ea4c89', opacity: 0.2,
				label: { text: 'NORMA', style: { color: '#ea4c89', background: '#fff', fontWeight: 900 } }
			}],
		},
		// POLSKIE FORMATOWANIE DATY W DYMKU (TOOLTIP)
		tooltip: {
			x: { format: 'dd.MM.yyyy' },
			theme: 'light'
		}
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
		<div className='max-w-4xl mx-auto px-4 pb-10'>
			<Form date={date} setValueHandler={setValue} updateData={updateData} value={value} setDateHandler={setDate} />

			{sortedEntries.length > 0 ? (
				<div className='bg-white rounded-[2rem] p-4 md:p-8 shadow-sm border border-pink-50 my-6'>
					<ApexCharts options={chartOptions} series={series} type='line' height={300} />
				</div>
			) : (
				<div className='bg-white rounded-[2rem] p-10 shadow-sm border-2 border-dashed border-pink-100 my-6 text-center'>
					<p className='text-gray-400 font-medium tracking-wide'>Brak danych do wyświetlenia na wykresie.</p>
				</div>
			)}

			<div className='mt-10 bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden'>
				<div className='bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex justify-between items-center'>
					<h3 className='text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]'>
						Historia wpisów
					</h3>
					<span className='bg-pink-100 text-pink-600 text-[10px] font-bold px-2 py-0.5 rounded-full'>
						{sortedEntries.length} wpisów
					</span>
				</div>

				<div className='max-h-[400px] overflow-y-auto p-4 md:p-6 custom-scrollbar'>
					<div className='space-y-3'>
						{sortedEntries.map(([dateKey, val]) => (
							<motion.div 
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								key={dateKey} 
								className='bg-white p-4 rounded-2xl border border-gray-50 flex justify-between items-center transition-all hover:bg-pink-50/30'
							>
								<div className='flex flex-col'>
									<span className='text-xs font-bold text-gray-800'>{dateKey}</span>
									<span className='text-[10px] text-gray-400 uppercase'>Data badania</span>
								</div>
								<div className='flex items-center gap-6'>
									<div className='text-right'>
										<span className='text-lg font-black text-pink-500'>{val}</span>
										<span className='text-[10px] ml-1 text-pink-300 font-bold'>INR</span>
									</div>
									<button 
										onClick={() => removeEntry(dateKey)}
										className='w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all active:scale-90'
									>
										<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
										</svg>
									</button>
								</div>
							</motion.div>
						))}

						{sortedEntries.length === 0 && (
							<div className='flex flex-col items-center py-10 opacity-30'>
								<div className='text-4xl mb-2'>📂</div>
								<p className='text-gray-400 text-sm'>Brak wpisów</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ChartComponent
