/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Workflow } from '@data-wrangling-components/core'
import type { FileWithPath } from '@data-wrangling-components/utilities'
import {
	FileCollection,
	FileExtensions,
	FileMimeType,
	FileType,
} from '@data-wrangling-components/utilities'
import { StatsColumnType } from '@essex/arquero-react'
import type { IDropdownOption } from '@fluentui/react'
import { Checkbox, Dropdown } from '@fluentui/react'
import { memo, useCallback, useState } from 'react'

import { FileDrop } from '~components/FileDrop'

import { useLoadSpecFile, useLoadTableFiles } from './ControlBar.hooks.js'
import {
	Container,
	Control,
	ControlBlock,
	Description,
	Drop,
	DropBlock,
	dropdownStyles,
	Examples,
	ExamplesContainer,
} from './ControlBar.styles.js'
import type { ControlBarProps } from './ControlBar.types.js'
import { ExamplesDropdown } from './ExamplesDropdown.js'

const options: IDropdownOption[] = Object.values(StatsColumnType).map(o => {
	return { key: o, text: o } as IDropdownOption
})

export const ControlBar: React.FC<ControlBarProps> = memo(function ControlBar({
	selected,
	features,
	compact,
	autoType,
	onSelectSpecification,
	onLoadFiles,
	onFeaturesChange,
	onCompactChange,
	onAutoTypeChange,
}) {
	const loadFiles = useLoadTableFiles()
	const loadSpec = useLoadSpecFile()
	const [fileCollection, setFileCollection] = useState<FileCollection>(
		new FileCollection(),
	)

	const updateFileCollection = useCallback(
		async (files: FileWithPath[]) => {
			await fileCollection.add(files)
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
			onLoadFiles?.(loaded)
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
			onSelectSpecification?.(new Workflow(spec))
		},
		[onSelectSpecification, loadSpec, updateFileCollection],
	)
	const handleDropZip = useCallback(
		(fileCollection: FileCollection) => {
			setFileCollection(fileCollection)
			handleDropCSV(fileCollection)
			handleDropJSON(fileCollection)
		},
		[handleDropCSV, handleDropJSON, setFileCollection],
	)

	const handleSmartHeadersChange = useCallback(
		(e: any, checked?: boolean) =>
			onFeaturesChange?.({ ...features, smartHeaders: checked }),
		[features, onFeaturesChange],
	)

	const handleFeaturesChange = useCallback(
		(propName: string, checked?: boolean) =>
			onFeaturesChange?.({ ...features, [propName]: checked }),
		[features, onFeaturesChange],
	)

	const handleStatsColumnTypeChange = useCallback(
		(e: any, option: IDropdownOption | undefined) => {
			const selectedKeys = features.statsColumnTypes || []
			const selectedTypes = option?.selected
				? [...selectedKeys, option.key as StatsColumnType]
				: selectedKeys.filter(key => key !== option?.key)

			option &&
				onFeaturesChange?.({
					...features,
					statsColumnTypes: selectedTypes,
				})
		},
		[features, onFeaturesChange],
	)
	const handleArrayFeaturesChange = useCallback(
		(propName: string, checked?: boolean) => {
			onFeaturesChange?.({
				...features,
				[propName]: checked,
			})
		},

		[features, onFeaturesChange],
	)

	const handleCompactChange = useCallback(
		(_e: any, checked: boolean | undefined) =>
			onCompactChange(checked ?? false),
		[onCompactChange],
	)

	const handleAutoTypeChange = useCallback(
		(_e: any, checked: boolean | undefined) =>
			onAutoTypeChange(checked ?? false),
		[onAutoTypeChange],
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
							? (selected as any)?.description ?? ''
							: 'Description for the selected example will show here'}
					</p>
				</Description>
			</ExamplesContainer>
			<ControlBlock>
				<Control>
					<Checkbox
						label={'Auto-type columns'}
						checked={autoType}
						onChange={handleAutoTypeChange}
					/>
				</Control>
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
						onChange={(e: any, checked) =>
							handleFeaturesChange('statsColumnHeaders', checked)
						}
					/>
					<Dropdown
						disabled={!features.statsColumnHeaders && !features.smartHeaders}
						onChange={handleStatsColumnTypeChange}
						multiSelect
						options={options}
						selectedKeys={features.statsColumnTypes}
						styles={dropdownStyles}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Column header histograms'}
						checked={features.histogramColumnHeaders}
						disabled={features.smartHeaders}
						onChange={(e: any, checked) =>
							handleFeaturesChange('histogramColumnHeaders', checked)
						}
					/>
				</Control>
			</ControlBlock>
			<ControlBlock>
				<Control>
					<Checkbox
						label={'Smart cells'}
						checked={features.smartCells}
						onChange={(e: any, checked) =>
							handleFeaturesChange('smartCells', checked)
						}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Number magnitude'}
						checked={features.showNumberMagnitude}
						disabled={features.smartCells}
						onChange={(e: any, checked) =>
							handleFeaturesChange('showNumberMagnitude', checked)
						}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Boolean symbol'}
						checked={features.showBooleanSymbol}
						disabled={features.smartCells}
						onChange={(e: any, checked) =>
							handleFeaturesChange('showBooleanSymbol', checked)
						}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Format date'}
						checked={features.showDateFormatted}
						disabled={features.smartCells}
						onChange={(e: any, checked) =>
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
						onChange={(e: any, checked) =>
							handleArrayFeaturesChange('showSparkbar', checked)
						}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Sparkline'}
						checked={!!features.showSparkline}
						disabled={features.smartCells}
						onChange={(e: any, checked) =>
							handleArrayFeaturesChange('showSparkline', checked)
						}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Categorical bar'}
						checked={!!features.showCategoricalBar}
						disabled={features.smartCells}
						onChange={(e: any, checked) =>
							handleArrayFeaturesChange('showCategoricalBar', checked)
						}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Multivalues on dropdown'}
						checked={!!features.showDropdown}
						disabled={features.smartCells}
						onChange={(e: any, checked) =>
							handleArrayFeaturesChange('showDropdown', checked)
						}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Compact rows'}
						checked={compact}
						onChange={handleCompactChange}
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
