/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FileWithPath } from '@datashaper/utilities'
import {
	FileCollection,
	FileExtensions,
	FileMimeType,
	FileType,
} from '@datashaper/utilities'
import { Workflow } from '@datashaper/workflow'
import { Checkbox } from '@fluentui/react'
import { memo, useCallback, useState } from 'react'

import { FileDrop } from '../FileDrop.js'
import { useLoadSpecFile, useLoadTableFiles } from './ControlBar.hooks.js'
import {
	Container,
	Control,
	ControlBlock,
	Description,
	Drop,
	DropBlock,
	Examples,
	ExamplesContainer,
} from './ControlBar.styles.js'
import type { ControlBarProps } from './ControlBar.types.js'
import { ExamplesDropdown } from './ExamplesDropdown.js'

export const ControlBar: React.FC<ControlBarProps> = memo(function ControlBar({
	selected,
	features,
	autoType,
	onSelectSpecification,
	onLoadFiles,
	onFeaturesChange,
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
						label={'Smart cells'}
						checked={features.smartCells}
						onChange={(e: any, checked) =>
							handleFeaturesChange('smartCells', checked)
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
