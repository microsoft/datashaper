/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Specification } from '@data-wrangling-components/core'
import { DetailsListFeatures } from '@data-wrangling-components/react'
import { Checkbox } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'
import React, { memo, useCallback } from 'react'
import styled from 'styled-components'
import { ExamplesDropdown } from './ExamplesDropdown'
import { useLoadSpecFile, useLoadTableFiles } from './hooks'
import { FileDrop } from '~components/FileDrop'

export interface ControlBarProps {
	selected?: Specification
	onSelectSpecification?: (spec: Specification | undefined) => void
	onLoadFiles?: (files: Map<string, ColumnTable>) => void
	features: DetailsListFeatures
	onFeaturesChange?: (features: DetailsListFeatures) => void
	compact: boolean
	onCompactChange?: (auto: boolean) => void
}

export const ControlBar: React.FC<ControlBarProps> = memo(function ControlBar({
	selected,
	onSelectSpecification,
	onLoadFiles,
	features,
	onFeaturesChange,
	compact,
	onCompactChange,
}) {
	const loadFiles = useLoadTableFiles()
	const loadSpec = useLoadSpecFile()
	const handleDropCSV = useCallback(
		async (files: File[]) => {
			const loaded = await loadFiles(files)
			onLoadFiles && onLoadFiles(loaded)
		},
		[onLoadFiles, loadFiles],
	)
	const handleDropJSON = useCallback(
		async (files: File[]) => {
			// ignore any after the first. I suppose we could auto-link the steps, but that's dangerous
			const first = files[0]
			const spec = await loadSpec(first)
			onSelectSpecification && onSelectSpecification(spec)
		},
		[onSelectSpecification, loadSpec],
	)

	const handleAutoRenderChange = useCallback(
		(e, checked?: boolean) =>
			onFeaturesChange && onFeaturesChange({ autoRender: checked }),
		[onFeaturesChange],
	)
	const handleColumnHistogramsChange = useCallback(
		(e, checked?: boolean) =>
			onFeaturesChange &&
			onFeaturesChange({ ...features, histogramColumnHeaders: checked }),
		[features, onFeaturesChange],
	)
	const handleColumnStatsChange = useCallback(
		(e, checked?: boolean) =>
			onFeaturesChange &&
			onFeaturesChange({ ...features, statsColumnHeaders: checked }),
		[features, onFeaturesChange],
	)

	const handleCompactChange = useCallback(
		(e, checked) => onCompactChange && onCompactChange(checked),
		[onCompactChange],
	)

	return (
		<Container>
			<Examples>
				<ExamplesDropdown onChange={onSelectSpecification} />
			</Examples>
			<Description>
				{selected ? <p>{selected.description}</p> : null}
			</Description>
			<ControlBlock>
				<Control>
					<Checkbox
						label={'Auto-render everything'}
						checked={features.autoRender}
						onChange={handleAutoRenderChange}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Compact'}
						checked={compact}
						onChange={handleCompactChange}
					/>
				</Control>
			</ControlBlock>
			<ControlBlock>
				<Control>
					<Checkbox
						label={'Column header stats'}
						checked={features.statsColumnHeaders}
						onChange={handleColumnStatsChange}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Column header histograms'}
						checked={features.histogramColumnHeaders}
						onChange={handleColumnHistogramsChange}
					/>
				</Control>
			</ControlBlock>
			<Drop>
				<FileDrop onDrop={handleDropCSV} />
			</Drop>
			<Drop>
				<FileDrop onDrop={handleDropJSON} extensions={['json']} />
			</Drop>
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	height: 52px;
	padding: 12px;
	margin-bottom: 40px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 12px;
`

const Examples = styled.div``

const Description = styled.div`
	width: 400px;
	padding-left: 12px;
	flex-direction: column;
	justify-content: center;
`

const ControlBlock = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`

const Control = styled.div`
	width: 200px;
`

const Drop = styled.div`
	width: 160px;
	height: 100%;
`
