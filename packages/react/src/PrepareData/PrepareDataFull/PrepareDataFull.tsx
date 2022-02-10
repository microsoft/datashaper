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
import { TablesList, PreviewTable, OutputTable } from '..'
import { StepsList } from '../../Steps'
import { usePipeline, useStore, useGroupedTables } from '../../common'

export const PrepareDataFull: React.FC<{
	tables: TableContainer[]
	steps?: Step[]
	onUpdateSteps: (steps: Step[]) => void
}> = memo(function PrepareDataFull({ tables, steps, onUpdateSteps }) {
	const [selectedTable, setSelectedTable] = useState<TableContainer>()
	const [intermediaryTables, setIntermediaryTables] = useState<string[]>([])
	const [outputs, setOutputs] = useState<Map<string, ColumnTable>>(
		new Map<string, ColumnTable>(),
	)
	const store = useStore()
	const pipeline = usePipeline(store)
	const groupedTables = useGroupedTables(intermediaryTables, store)

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
		await pipeline.run()
		const output = await store.toMap()
		pipeline.print()
		store.print()
		setOutputs(output)
		setIntermediaryTables(pipeline.outputs)
	}, [pipeline, store, setOutputs])

	useEffect(() => {
		if (steps?.length && !outputs?.size && !!tables.length) {
			pipeline.addAll(steps)
			runPipeline()
		}
	}, [pipeline, steps, tables, runPipeline, outputs])

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
				//what if it's different
				//what if it's a delete
				await store.get(table.name)
			} catch (e) {
				store.set(table.name, table?.table as ColumnTable)
			}
		})
	}, [tables, store])

	return (
		<Container>
			<InputContainer>
				<TablesListContainer>
					<SectionTitle>Inputs</SectionTitle>
					<TablesList
						files={groupedTables}
						selected={selectedTable?.name}
						onSelect={onSelect}
					/>
					<SectionSeparator vertical />
				</TablesListContainer>
				<InputDetailsContainer>
					<PreviewContainer>
						<SectionTitle>Preview</SectionTitle>
						<PreviewTable table={selectedTable} />
					</PreviewContainer>
					<StepsContainer>
						<SectionTitle>Steps</SectionTitle>
						<StepsList
							onDelete={onDeleteStep}
							onSave={onSaveStep}
							onSelect={onSelect}
							store={store}
							steps={steps}
						/>
					</StepsContainer>
				</InputDetailsContainer>
			</InputContainer>

			<OutputContainer>
				<SectionTitle>Output</SectionTitle>
				<OutputTable output={output} onTransform={onSaveStep} />
			</OutputContainer>
		</Container>
	)
})

const SectionTitle = styled.span`
	font-weight: bold;
	writing-mode: vertical-rl;
	transform: rotate(180deg);
	font-size: 15px;
	align-self: center;
	text-transform: uppercase;
	color: ${({ theme }) => theme.palette.neutralLight};
`

const Container = styled.div`
	height: 100%;
	position: fixed;
	width: 100%;
`

const PreviewContainer = styled.div`
	display: flex;
	height: 53%;
	border-bottom: 1px solid ${({ theme }) => theme.application().faint().hex()};
`

const InputContainer = styled.div`
	height: 47%;
	display: flex;
	overflow: hidden;
	padding-bottom: 10px;
	border-bottom: 1px solid ${({ theme }) => theme.application().faint().hex()};
`

const OutputContainer = styled.div`
	padding: 10px;
	height: 45%;
	display: flex;
`

const SectionSeparator = styled(Separator)`
	padding: 14px;
	height: 90%;
`

const StepsContainer = styled.div`
	padding-bottom: 10px;
	/* height: 20%; */
	height: 47%;
	display: flex;
	column-gap: 8px;
	overflow: auto;
	border-bottom: 1px solid ${({ theme }) => theme.application().faint().hex()};
`

const TablesListContainer = styled.div`
	display: flex;
	width: 30%;
`

const InputDetailsContainer = styled.div`
	width: 67%;
`
