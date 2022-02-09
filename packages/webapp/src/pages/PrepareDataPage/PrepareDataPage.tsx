/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import { Step, TableStore } from '@data-wrangling-components/core'
import {
	TablesList,
	InputTable,
	TableFile,
	OutputTable,
	StepsList,
} from '@data-wrangling-components/react'
import { Separator } from '@fluentui/react'
import { loadCSV } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { usePipeline } from '~pages/MainPage/hooks'

interface Table {
	name: string
	table: ColumnTable
}

export function useInputTables(
	outputs: Map<string, ColumnTable>,
	store: TableStore,
): Map<string, ColumnTable> {
	const [tables, setTables] = useState<Map<string, ColumnTable>>(
		new Map<string, ColumnTable>(),
	)
	useEffect(() => {
		const f = async () => {
			const results = await store.toMap()
			setTables(results)
		}
		f()
	}, [outputs, store, setTables])
	return tables
}

export function useTableStore(): TableStore {
	return useMemo(() => {
		return new TableStore()
	}, [])
}

export const PrepareDataPage: React.FC = memo(function PrepareDataPage() {
	const [tables, setTables] = useState<Table[]>([])
	const [selectedTable, setSelectedTable] = useState<TableFile>()
	const [steps, setSteps] = useState<Step[]>([])

	const [result, setResult] = useState<ColumnTable | undefined>()
	const [outputs, setOutputs] = useState<Map<string, ColumnTable>>(
		new Map<string, ColumnTable>(),
	)
	const store = useTableStore()
	const inputTables = useInputTables(outputs, store)
	const pipeline = usePipeline(store)

	const onSelect = useCallback(
		async (name: any) => {
			const table = await store.get(name)
			setSelectedTable({ table, name: name })
		},
		[setSelectedTable, store],
	)

	const runPipeline = useCallback(async () => {
		const res = await pipeline.run()
		const output = await store.toMap()
		pipeline.print()
		store.print()
		setResult(res)
		setOutputs(output)
	}, [pipeline, store, setResult, setOutputs])

	useEffect(() => {
		if (steps.length && !result && tables.length) {
			pipeline.addAll(steps)
			runPipeline()
		}
	}, [pipeline, steps, tables, runPipeline, result])

	const onSaveStep = useCallback(
		(step: Step, index?: number) => {
			if (index !== undefined) {
				setSteps(pipeline.update(step, index))
			} else {
				setSteps(pipeline.add(step))
			}
			runPipeline()
		},
		[pipeline, setSteps, runPipeline],
	)

	const onDeleteStep = useCallback(
		(index?: number) => {
			const _steps = steps.slice(0, index)
			pipeline.clear()
			pipeline.addAll(_steps)
			setSteps(_steps)
			runPipeline()
		},
		[pipeline, setSteps, runPipeline, steps],
	)

	const storeTables = useCallback(
		(tablesList: Table[]) => {
			tablesList.forEach(table => {
				store.set(table.name, table.table)
			})
		},
		[store],
	)

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
			] as Table[]
			setTables(tablesList)
			storeTables(tablesList)

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
	}, [storeTables])

	return (
		<Container>
			<InputContainer>
				<TablesList
					files={inputTables}
					selected={selectedTable?.name}
					onSelect={onSelect}
				/>
				<SectionSeparator vertical />
				<InputTable table={selectedTable} />
			</InputContainer>
			<Separator />
			<StepsContainer>
				<StepsList
					onDelete={onDeleteStep}
					onSave={onSaveStep}
					store={store}
					steps={steps}
					onSelect={onSelect}
				/>
			</StepsContainer>
			<Separator />
			<OutputContainer>
				<OutputTable table={result} />
			</OutputContainer>
		</Container>
	)
})

const Container = styled.div``

const InputContainer = styled.div`
	height: 23vh;
	display: flex;
	max-height: inherit;
	overflow: hidden;
`

const SectionSeparator = styled(Separator)`
	padding: 14px;
`

const StepsContainer = styled.div`
	height: 20vh;
	display: flex;
	column-gap: 8px;
	overflow: auto;
`

const OutputContainer = styled.div`
	height: 40vh;
`
