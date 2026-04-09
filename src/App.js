import React from 'react'
import Menu from './components/Menu'
import ChartComponent from './components/ChartComponent'
import Counter from './components/Counter'
import LoadingPage from './components/LoadingPage'
import { fetchData } from './util/http'
import { useQuery } from '@tanstack/react-query'
import ErrorBlock from './components/ErrorBlock'
import { motion, AnimatePresence } from 'framer-motion'

const App = () => {
	const { data, isPending, isError } = useQuery({
		queryKey: ['counters'],
		queryFn: ({ signal }) => fetchData({ signal, path: 'counters' }),
	})

	// Animacja wejścia dla całej siatki kart
	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1, // Karty pojawiają się jedna po drugiej
			},
		},
	}

	if (isPending) {
		return <LoadingPage />
	}

	if (isError) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
				<ErrorBlock title='Błąd połączenia' message='Nie udało się pobrać Twoich danych. Sprawdź połączenie z internetem.' />
			</div>
		)
	}

	if (data) {
		const daysOrder = ['poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota', 'niedziela']
		
		const correctOrder = {}
		daysOrder.forEach(day => {
			if (data[day] !== undefined) {
				correctOrder[day] = data[day]
			}
		})

		return (
			<div className='min-h-screen bg-[#fafafa] pb-20'>
				{/* Górny panel ze statystykami */}
				<Menu counterData={correctOrder} />

				<main className='max-w-7xl mx-auto px-4'>
					{/* Sekcja kart - RESPONSYWNY GRID */}
					<motion.div 
						variants={containerVariants} 
						initial='hidden' 
						animate='show' 
						className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'
					>
						<AnimatePresence>
							{Object.entries(correctOrder).map(([day, count]) => (
								<Counter key={day} counterData={count} day={day} />
							))}
						</AnimatePresence>
					</motion.div>

					{/* Sekcja wykresu i formularza */}
					<div className='mt-16'>
						<ChartComponent />
					</div>
				</main>

				{/* Stopka z nazwą aplikacji */}
				<footer className='text-center py-10'>
					<p className='text-[10px] font-black uppercase tracking-[0.5em] text-gray-300'>
						Pill Planner v2.0
					</p>
				</footer>
			</div>
		)
	}

	return null
}

export default App
