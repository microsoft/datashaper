/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import { Step, TableContainer } from '@data-wrangling-components/core'
import { PrepareDataFull } from '@data-wrangling-components/react'
import { loadCSV } from 'arquero'
import React, { memo, useEffect, useState } from 'react'

export const PrepareDataPage: React.FC = memo(function PrepareDataPage() {
	const [tables, setTables] = useState<TableContainer[]>([])
	const [steps, setSteps] = useState<Step[]>([])

	useEffect(() => {
		const f = async () => {
			const companies = await loadCSV('data/companies.csv', {})
			const products = await loadCSV('data/products.csv', {})

			const tablesList = [
				{
					name: 'companies',
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

	return (
		<PrepareDataFull tables={tables} steps={steps} onUpdateSteps={setSteps} />
	)
})
