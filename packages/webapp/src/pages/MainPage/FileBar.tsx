/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Specification } from '@data-wrangling-components/core'
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
	width: 100%;
	padding-left: 12px;
	flex-direction: column;
	justify-content: center;
`

const Drop = styled.div`
	width: 240px;
	height: 100%;
`
