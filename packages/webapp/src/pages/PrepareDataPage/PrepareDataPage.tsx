/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, Verb, TableStore } from '@data-wrangling-components/core'
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

export function useTableStore(tables: Table[]): TableStore {
	return useMemo(() => {
		const store = new TableStore()
		tables.forEach(table => {
			store.set(table.name, table.table)
		})
		return store
	}, [tables])
}

export const PrepareDataPage: React.FC = memo(function PrepareDataPage() {
	const [tables, setTables] = useState<Table[]>([])
	const [selectedTable, setSelectedTable] = useState<TableFile>()
	const [steps, setSteps] = useState<Step[]>([
		{
			verb: 'join',
			input: 'companies',
			output: 'join-1',
			args: {
				other: 'products',
				on: ['ID'],
			},
		},
	])

	const [result, setResult] = useState<ColumnTable | undefined>()
	const [outputs, setOutputs] = useState<Map<string, ColumnTable>>(
		new Map<string, ColumnTable>(),
	)
	const store = useTableStore(tables)
	const inputTables = useInputTables(outputs, store)
	const pipeline = usePipeline(store) //passing the store

	useEffect(() => {
		if (steps.length && !result && tables.length) {
			pipeline.clear()
			pipeline.addAll(steps)
			handleRunClick()
		}
	}, [pipeline, steps, tables])

	const onSelect = useCallback(
		async (name: any) => {
			const table = await store.get(name)
			setSelectedTable({ table, name: name })
		},
		[tables, setSelectedTable],
	)

	const handleCreateStep = useCallback(
		(verb: Verb) => setSteps(pipeline.create(verb)),
		[pipeline, setSteps],
	)

	const handleStepChange = useCallback(
		(step: Step, index: number) => setSteps(pipeline.update(step, index)),
		[setSteps, pipeline],
	)

	const handleRunClick = useCallback(async () => {
		const res = await pipeline.run()
		const output = await store.toMap()
		pipeline.print()
		store.print()
		setResult(res)
		setOutputs(output)
	}, [pipeline, store, setResult, setOutputs])

	useEffect(() => {
		const f = async () => {
			const companies = await loadCSV('data/companies.csv', {})
			const products = await loadCSV('data/products.csv', {})
			// make sure we have a large enough number of rows to impact rendering perf
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
		}
		f()
	}, [])

	return (
		<Container>
			<InputContainer>
				<TablesList files={inputTables} onSelect={onSelect} />
				<SectionSeparator vertical />
				<InputTable table={selectedTable} />
			</InputContainer>
			<Separator />
			<StepsContainer>
				<StepsList steps={steps} />
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
