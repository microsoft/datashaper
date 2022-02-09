/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import { Step, TableContainer } from '@data-wrangling-components/core'
import { Separator } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { TablesList, InputTable, OutputTable } from '..'
import { StepsList } from '../../Steps'
import { usePipeline, useStore, useInputTables } from '../../common'

export const PrepareDataFull: React.FC<{
	tables: TableContainer[]
	steps?: Step[]
	onUpdateSteps: (steps: Step[]) => void
}> = memo(function PrepareDataFull({ tables, steps, onUpdateSteps }) {
	const [selectedTable, setSelectedTable] = useState<TableContainer>()
	const [result, setResult] = useState<ColumnTable | undefined>()
	const [outputs, setOutputs] = useState<Map<string, ColumnTable>>(
		new Map<string, ColumnTable>(),
	)
	const store = useStore()
	const inputTables = useInputTables(outputs, store)

	const pipeline = usePipeline(store)

	const output = useMemo((): TableContainer => {
		const name = pipeline?.last?.output
		const table = outputs.get(name)
		return {
			name,
			table,
		} as TableContainer
	}, [pipeline, outputs])

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
		if (steps?.length && !result && tables.length) {
			pipeline.addAll(steps)
			runPipeline()
		}
	}, [pipeline, steps, tables, runPipeline, result])

	const onSaveStep = useCallback(
		(step: Step, index?: number) => {
			if (index !== undefined) {
				onUpdateSteps(pipeline.update(step, index))
			} else {
				onUpdateSteps(pipeline.add(step))
			}
			runPipeline()
		},
		[pipeline, onUpdateSteps, runPipeline],
	)

	const onDeleteStep = useCallback(
		(index?: number) => {
			if (!steps) {
				return null
			}
			const _steps = steps && steps.slice(0, index)
			pipeline.clear()
			pipeline.addAll(_steps)
			onUpdateSteps(_steps)
			runPipeline()
		},
		[pipeline, onUpdateSteps, runPipeline, steps],
	)

	useEffect(() => {
		tables.forEach(async table => {
			try {
				await store.get(table.name)
			} catch (e) {
				store.set(table.name, table?.table as ColumnTable)
			}
		})
	}, [tables, store])

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
					onSelect={onSelect}
					store={store}
					steps={steps}
				/>
			</StepsContainer>
			<Separator />
			<OutputContainer>
				<OutputTable output={output} onTransform={onSaveStep} />
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
