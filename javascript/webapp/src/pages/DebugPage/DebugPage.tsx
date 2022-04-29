/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import type { Specification } from '@data-wrangling-components/core'
import { StepComponent, StepSelector } from '@data-wrangling-components/react'
import type { DetailsListFeatures } from '@essex/arquero-react'
import { StatsColumnType } from '@essex/arquero-react'
import { IconButton, PrimaryButton } from '@fluentui/react'
import { memo, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { ControlBar } from './ControlBar'
import { useSteps, useTables } from './DebugPage.hooks'
import { InputTables } from './InputTables'
import { Section } from './Section'
import { Table } from './Table'

const columns = {
	ID: {
		width: 50,
		iconName: 'FavoriteStarFill',
	},
}

const DEFAULT_STATS = [
	StatsColumnType.Type,
	StatsColumnType.Min,
	StatsColumnType.Max,
	StatsColumnType.Distinct,
	StatsColumnType.Invalid,
]

export const DebugPage: React.FC = memo(function DebugPage() {
	const [autoType, setAutoType] = useState<boolean>(true)

	const { tables, store, onAddFiles } = useTables(autoType)

	const {
		steps,
		result,
		outputs,
		onStepCreate,
		onStepChange,
		onLoadPipeline,
		doRunPipeline,
	} = useSteps(store)

	const [features, setFeatures] = useState<DetailsListFeatures>({
		statsColumnHeaders: true,
		statsColumnTypes: DEFAULT_STATS,
	})

	const [compact, setCompact] = useState<boolean>(true)

	const [exampleSpec, setExampleSpec] = useState<Specification | undefined>()

	const handleExampleSpecChange = useCallback(
		(spec: Specification | undefined) => {
			setExampleSpec(spec)
			onLoadPipeline(spec)
		},
		[setExampleSpec, onLoadPipeline],
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
					onLoadFiles={onAddFiles}
					features={features}
					onFeaturesChange={setFeatures}
					compact={compact}
					onCompactChange={setCompact}
					autoType={autoType}
					onAutoTypeChange={setAutoType}
				/>
				<InputsSection>
					<Section title="Inputs">
						<InputTables
							tables={tables}
							config={columns}
							features={features}
							compact={compact}
						/>
					</Section>
				</InputsSection>
				{steps.map((step, index) => {
					const output = outputs?.get(step.output?.target)?.table
					return (
						<StepBlock key={`step-${index}`} className="step-block">
							<Section title={`Step ${index + 1}`} subtitle={step.verb}>
								<StepsColumn className="steps-column">
									<StepComponent
										key={`step-${index}`}
										step={step}
										store={store}
										index={index}
										onChange={onStepChange}
									/>
								</StepsColumn>
								<OutputsColumn className="outputs-column">
									{output ? (
										<TableSection
											key={`output-${index}`}
											className="table-section"
										>
											<Table
												name={step.id}
												table={output}
												config={columns}
												features={features}
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
					subtitle={'FINAL RESULT'}
				>
					{result ? (
						<TableSection className="table-section">
							<Table
								table={result!.table!}
								config={columns}
								features={features}
								compact={compact}
							/>
						</TableSection>
					) : null}
				</Section>
				<Commands>
					<StepSelector onCreate={onStepCreate} showButton />
					<Buttons>
						<PrimaryButton
							onClick={doRunPipeline}
							styles={{ root: { width: 180 } }}
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
	padding: 0px 20px 0px 20px;
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
	max-height: 400px;
`

const StepsColumn = styled.div`
	width: 600px;
`

const OutputsColumn = styled.div`
	margin-left: 40px;
	display: flex;
	flex-direction: column;
`
