/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, TableContainer } from '@data-wrangling-components/core'
import { PrepareDataFull } from '@data-wrangling-components/react'
import { loadCSV } from 'arquero'
import React, { memo, useEffect, useState } from 'react'

export const PrepareDataPage: React.FC = memo(function PrepareDataPage() {
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
				{
					verb: 'join',
					input: 'companies',
					output: 'join-3',
					args: {
						other: 'products',
						on: ['ID', 'ID'],
					},
				},
				{
					verb: 'join',
					input: 'companies',
					output: 'join-4',
					args: {
						other: 'products',
						on: ['ID', 'ID'],
					},
				},
				{
					verb: 'join',
					input: 'companies',
					output: 'join-5',
					args: {
						other: 'products',
						on: ['ID', 'ID'],
					},
				},
				{
					verb: 'join',
					input: 'companies',
					output: 'join-6',
					args: {
						other: 'products',
						on: ['ID', 'ID'],
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

	//fix: what if we have other components on the same page
	return (
		<PrepareDataFull tables={tables} steps={steps} onUpdateSteps={setSteps} />
	)
})
