/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Specification } from '@data-wrangling-components/core'
import {
	FileCollection,
	FileType,
	FileMimeType,
} from '@data-wrangling-components/utilities/common'
import { internal as ArqueroTypes } from 'arquero'
import React, { memo, useCallback } from 'react'
import styled from 'styled-components'
import { ExamplesDropdown } from './ExamplesDropdown'
import { useLoadSpecFile, useLoadTableFiles } from './hooks'
import { FileDrop } from '~components/FileDrop'

export interface FileBarProps {
	selected?: Specification
	onSelectSpecification?: (spec: Specification | undefined) => void
	onLoadFiles?: (files: Map<string, ArqueroTypes.ColumnTable>) => void
}

export const FileBar: React.FC<FileBarProps> = memo(function FileBar({
	selected,
	onSelectSpecification,
	onLoadFiles,
}) {
	const loadFiles = useLoadTableFiles()
	const loadSpec = useLoadSpecFile()
	const handleDropCSV = useCallback(
		async (fileCollection: FileCollection) => {
			const files = fileCollection.list(FileType.csv)
			const loaded = await loadFiles(files)
			onLoadFiles && onLoadFiles(loaded)
		},
		[onLoadFiles, loadFiles],
	)
	const handleDropJSON = useCallback(
		async (fileCollection: FileCollection) => {
			// ignore any after the first. I suppose we could auto-link the steps, but that's dangerous
			const files = fileCollection.list(FileType.json)
			const first = files[0]
			const spec = await loadSpec(first)
			onSelectSpecification && onSelectSpecification(spec)
		},
		[onSelectSpecification, loadSpec],
	)
	const handleDropZip = useCallback(
		async (fileCollection: FileCollection) => {
			handleDropCSV(fileCollection)
			handleDropJSON(fileCollection)
		},
		[handleDropCSV, handleDropJSON],
	)

	return (
		<Container>
			<Examples>
				<ExamplesDropdown onChange={onSelectSpecification} />
			</Examples>
			<Description>
				{selected ? <p>{selected.description}</p> : null}
			</Description>
			<Drop>
				<FileDrop onDrop={handleDropCSV} />
			</Drop>
			<Drop>
				<FileDrop onDrop={handleDropJSON} extensions={[FileMimeType.json]} />
			</Drop>
			<Drop>
				<FileDrop onDrop={handleDropZip} extensions={[FileMimeType.zip]} />
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
	width: 100%;
	padding-left: 12px;
	flex-direction: column;
	justify-content: center;
`

const Drop = styled.div`
	width: 240px;
	height: 100%;
`
