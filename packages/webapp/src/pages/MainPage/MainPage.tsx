/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import { Step, StepType, Specification } from '@data-wrangling-components/core'
import {
	selectStepComponent,
	WithTableDropdown,
} from '@data-wrangling-components/react'
import { IconButton, PrimaryButton } from '@fluentui/react'

import ColumnTable from 'arquero/dist/types/table/column-table'
import React, { memo, useState, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { ControlBar } from './ControlBar'
import { InputTables } from './InputTables'
import { Section } from './Section'
import { StepSelector } from './StepSelector'
import { Table } from './Table'
import {
	useInputTableList,
	useInputTables,
	useTableStore,
	usePipeline,
} from './hooks'

const columns = {
	ID: {
		width: 30,
	},
}
export const MainPage: React.FC = memo(function MainMage() {
	// this is special to the test example,
	// a running app needs to maintain its own list of uploaded files
	const [inputList, setInputs] = useInputTableList()
	const store = useTableStore()
	const inputTables = useInputTables(inputList, store)
	const pipeline = usePipeline(store)
	const [result, setResult] = useState<ColumnTable | undefined>()
	const [outputs, setOutputs] = useState<Map<string, ColumnTable>>(
		new Map<string, ColumnTable>(),
	)
	const [exampleSpec, setExampleSpec] = useState<Specification | undefined>()

	const [autoRender, setAutoRender] = useState<boolean>(true)
	const [compact, setCompact] = useState<boolean>(true)

	const [steps, setSteps] = useState<Step[]>([])

	const handleCreateStep = useCallback(
		(type: StepType, subtype: string) =>
			setSteps(pipeline.create(type, subtype)),
		[pipeline, setSteps],
	)

	const handleStepChange = useCallback(
		(step: Step, index: number) => setSteps(pipeline.update(step, index)),
		[setSteps, pipeline],
	)

	const handleRunClick = useCallback(async () => {
		const res = await pipeline.run()
		const output = await store.toMap()
		store.print()
		setResult(res)
		setOutputs(output)
	}, [pipeline, store, setResult, setOutputs])

	const handleExampleSpecChange = useCallback(
		async spec => {
			// TODO: we need an autorun option on the pipeline to populate data for the next step as they are added
			// otherwise we can't fill in dropdowns with column names, for example
			setExampleSpec(spec)
			setSteps(spec.steps)
			pipeline.clear()
			pipeline.addAll(spec.steps)
			const res = await pipeline.run()
			const output = await store.toMap()
			store.print()
			setResult(res)
			setOutputs(output)
		},
		[pipeline, store, setExampleSpec, setSteps, setOutputs, setResult],
	)

	const handleDropFiles = useCallback(
		async (loaded: Map<string, ColumnTable>) => {
			loaded.forEach((table, name) => {
				store.set(name, table)
			})
			store.print()
			setInputs(prev => [...prev, ...Array.from(loaded.keys())])
		},
		[store, setInputs],
	)

	const downloadUrl = useMemo(() => {
		const blob = new Blob([JSON.stringify({ steps }, null, 4)])
		return URL.createObjectURL(blob)
	}, [steps])

	return (
		<Container>
			<Workspace className="arquero-workspace">
				<ControlBar
					selected={exampleSpec}
					onSelectSpecification={handleExampleSpecChange}
					onLoadFiles={handleDropFiles}
					autoRender={autoRender}
					onAutoRenderChange={setAutoRender}
					compact={compact}
					onCompactChange={setCompact}
				/>
				<InputsSection>
					<Section title="Inputs">
						<InputTables
							tables={inputTables}
							config={columns}
							autoRender={autoRender}
							compact={compact}
						/>
					</Section>
				</InputsSection>
				{steps.map((step, index) => {
					const Component = selectStepComponent(step)
					const output = outputs?.get(step.output)
					return (
						<StepBlock key={`step-${index}`} className="step-block">
							<Section
								title={`Step ${index + 1}`}
								subtitle={step.verb}
								type={step.type}
							>
								<StepsColumn>
									<WithTableDropdown
										Component={Component}
										step={step}
										store={store}
										onChange={s => handleStepChange(s, index)}
									/>
								</StepsColumn>
								<OutputsColumn className="outputs-column">
									{output ? (
										<TableSection
											key={`output-${index}`}
											className="table-section"
										>
											<Table
												name={step.output}
												table={output}
												config={columns}
												autoRender={autoRender}
												compact={compact}
											/>
										</TableSection>
									) : null}
								</OutputsColumn>
							</Section>
						</StepBlock>
					)
				})}
				<Section
					title={`${steps.length} step${steps.length !== 1 ? 's' : ''}`}
					subtitle={'FINAl RESULT'}
				>
					{result ? (
						<TableSection className="table-section">
							<Table
								table={result}
								config={columns}
								autoRender={autoRender}
								compact={compact}
							/>
						</TableSection>
					) : null}
				</Section>
				<Commands>
					<StepSelector onCreate={handleCreateStep} />
					<Buttons>
						<PrimaryButton
							onClick={handleRunClick}
							styles={{ root: { flex: 2 } }}
						>
							Run all
						</PrimaryButton>
						<IconButton
							title={'Save pipeline as JSON'}
							iconProps={{ iconName: 'Download' }}
							href={downloadUrl}
							download={'pipeline.json'}
							type={'application/json'}
						/>
					</Buttons>
				</Commands>
			</Workspace>
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
`

const Workspace = styled.div`
	width: 100%;
`

const Commands = styled.div`
	width: 200px;
	display: flex;
	flex-direction: column;
	gap: 12px;
	justify-content: space-between;
`

const Buttons = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
`

const StepBlock = styled.div`
	display: flex;
`

const InputsSection = styled.div`
	margin-bottom: 80px;
`

const TableSection = styled.div`
	max-height: 300px;
	overflow-y: scroll;
`

const StepsColumn = styled.div`
	width: 600px;
`

const OutputsColumn = styled.div`
	margin-left: 40px;
	display: flex;
	flex-direction: column;
`
