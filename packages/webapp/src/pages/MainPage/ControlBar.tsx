/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Specification } from '@data-wrangling-components/core'
import { DetailsListFeatures } from '@data-wrangling-components/react'
import {
	FileCollection,
	FileType,
	FileExtensions,
	FileMimeType,
	FileWithPath,
} from '@data-wrangling-components/utilities'
import { Checkbox } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'
import React, { memo, useCallback, useState } from 'react'
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
	const [fileCollection, setFileCollection] = useState<FileCollection>(
		new FileCollection(),
	)

	const updateFileCollection = useCallback(
		async (files: FileWithPath[]) => {
			if (!fileCollection.list().length) {
				await fileCollection.init(files)
			} else {
				await Promise.all(files.map((f: FileWithPath) => fileCollection.add(f)))
			}
			setFileCollection(fileCollection)
		},
		[fileCollection, setFileCollection],
	)

	const handleDropCSV = useCallback(
		async (fc: FileCollection) => {
			const files = fc.list(FileType.csv)
			if (!files.length) return
			updateFileCollection(files)
			const loaded = await loadFiles(files)
			onLoadFiles && onLoadFiles(loaded)
		},
		[onLoadFiles, loadFiles, updateFileCollection],
	)
	const handleDropJSON = useCallback(
		async (fc: FileCollection) => {
			// ignore any after the first. I suppose we could auto-link the steps, but that's dangerous
			const files = fc.list(FileType.json)
			const first = files[0]
			if (!first) return
			updateFileCollection([first])
			const spec = await loadSpec(first)
			onSelectSpecification && onSelectSpecification(spec)
		},
		[onSelectSpecification, loadSpec, updateFileCollection],
	)
	const handleDropZip = useCallback(
		async (fileCollection: FileCollection) => {
			setFileCollection(fileCollection)
			handleDropCSV(fileCollection)
			handleDropJSON(fileCollection)
		},
		[handleDropCSV, handleDropJSON, setFileCollection],
	)

	const handleSmartHeadersChange = useCallback(
		(e, checked?: boolean) =>
			onFeaturesChange &&
			onFeaturesChange({ ...features, smartHeaders: checked }),
		[features, onFeaturesChange],
	)

	const handleFeaturesChange = useCallback(
		(propName: string, checked?: boolean) =>
			onFeaturesChange &&
			onFeaturesChange({ ...features, [propName]: checked }),
		[features, onFeaturesChange],
	)
	const handleArrayFeaturesChange = useCallback(
		(propName: string, checked?: boolean) => {
			onFeaturesChange &&
				onFeaturesChange({
					...features,
					showSparkline: false,
					showSparkbar: false,
					showCategoricalBar: false,
					showDropdown: false,
					[propName]: checked,
				})
		},

		[features, onFeaturesChange],
	)

	const handleCompactChange = useCallback(
		(e, checked) => onCompactChange && onCompactChange(checked),
		[onCompactChange],
	)

	return (
		<Container>
			<ExamplesContainer>
				<Examples>
					<ExamplesDropdown onChange={onSelectSpecification} />
				</Examples>
				<Description>
					<p>
						{selected
							? selected.description
							: 'Description for the selected example will show here'}
					</p>
				</Description>
			</ExamplesContainer>
			<ControlBlock>
				<Control>
					<Checkbox
						label={'Smart headers'}
						checked={features.smartHeaders}
						onChange={handleSmartHeadersChange}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Column header stats'}
						checked={features.statsColumnHeaders}
						disabled={features.smartHeaders}
						onChange={(e, checked) =>
							handleFeaturesChange('statsColumnHeaders', checked)
						}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Column header histograms'}
						checked={features.histogramColumnHeaders}
						disabled={features.smartHeaders}
						onChange={(e, checked) =>
							handleFeaturesChange('histogramColumnHeaders', checked)
						}
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
						label={'Smart cells'}
						checked={features.smartCells}
						onChange={(e, checked) =>
							handleFeaturesChange('smartCells', checked)
						}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Number magnitude'}
						checked={features.showNumberMagnitude}
						disabled={features.smartCells}
						onChange={(e, checked) =>
							handleFeaturesChange('showNumberMagnitude', checked)
						}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Boolean symbol'}
						checked={features.showBooleanSymbol}
						disabled={features.smartCells}
						onChange={(e, checked) =>
							handleFeaturesChange('showBooleanSymbol', checked)
						}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Format date'}
						checked={features.showDateFormatted}
						disabled={features.smartCells}
						onChange={(e, checked) =>
							handleFeaturesChange('showDateFormatted', checked)
						}
					/>
				</Control>
			</ControlBlock>
			<ControlBlock>
				<Control>
					<Checkbox
						label={'Sparkbar'}
						checked={!!features.showSparkbar}
						disabled={features.smartCells}
						onChange={(e, checked) =>
							handleArrayFeaturesChange('showSparkbar', checked)
						}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Sparkline'}
						checked={!!features.showSparkline}
						disabled={features.smartCells}
						onChange={(e, checked) =>
							handleArrayFeaturesChange('showSparkline', checked)
						}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Categorical bar'}
						checked={!!features.showCategoricalBar}
						disabled={features.smartCells}
						onChange={(e, checked) =>
							handleArrayFeaturesChange('showCategoricalBar', checked)
						}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Multivalues on dropdown'}
						checked={!!features.showDropdown}
						disabled={features.smartCells}
						onChange={(e, checked) =>
							handleArrayFeaturesChange('showDropdown', checked)
						}
					/>
				</Control>
			</ControlBlock>
			<DropBlock>
				<Drop>
					<FileDrop onDrop={handleDropCSV} />
				</Drop>
				<Drop>
					<FileDrop
						onDrop={handleDropJSON}
						extensions={[FileExtensions.json]}
					/>
				</Drop>
				<Drop>
					<FileDrop onDrop={handleDropZip} extensions={[FileMimeType.zip]} />
				</Drop>
			</DropBlock>
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	padding: 0 12px 12px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 170px;
	margin-bottom: 2rem;
`

const Examples = styled.div``
const ExamplesContainer = styled.div``

const Description = styled.div`
	width: 400px;
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

const DropBlock = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	gap: 10px;
`

const Drop = styled.div`
	width: 160px;
	height: 50px;
`
