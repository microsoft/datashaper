/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, TableContainer } from '@data-wrangling-components/core'
import { loadCSV } from 'arquero'
import { useEffect, useState } from 'react'

export function useBusinessLogic(): {
	setSteps: (steps: Step[]) => void
	steps: Step[]
	tables: TableContainer[]
} {
	const [tables, setTables] = useState<TableContainer[]>([])
	const [steps, setSteps] = useState<Step[]>([])

	useEffect(() => {
		const f = async () => {
			const [companies, products] = await Promise.all([
				loadCSV('data/companies.csv', {}),
				loadCSV('data/products.csv', {}),
			])

			const tablesList = [
				{
					name: 'companies',
					table: companies,
				},
				{
					name: 'companie2s',
					table: companies,
				},
				{
					name: 'products',
					table: products,
				},
			] as TableContainer[]
			setTables(tablesList)

			const steps = [
				{
					verb: 'join',
					input: 'companies',
					output: 'join-1',
					args: {
						other: 'products',
						on: ['ID'],
					},
				},
				{
					verb: 'join',
					input: 'companies',
					output: 'join-2',
					args: {
						other: 'products',
						on: ['ID', 'ID'],
					},
				},
			]
			setSteps(steps)
		}
		f()
	}, [])

	return {
		setSteps,
		steps,
		tables,
	}
}
