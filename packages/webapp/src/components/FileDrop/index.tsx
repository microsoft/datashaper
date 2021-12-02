/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Theme } from '@thematic/core'
import { useThematic } from '@thematic/react'
import { memo } from 'react'
import { useDropzone } from 'react-dropzone'
import styled from 'styled-components'

export interface FileDropProps {
	onDrop?: (files: File[]) => void
	// full text to print in drop down
	text?: string
	// supported file extensions
	// TODO: if extensions are supplied, then can be used to filter the dropped list
	extensions?: string[]
}

export const FileDrop: React.FC<FileDropProps> = memo(function FileDrop({
	onDrop,
	text,
	extensions = ['csv'],
}) {
	const theme = useThematic()
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
	})
	return (
		<DropZone theme={theme} {...getRootProps()} active={isDragActive}>
			<input {...getInputProps()} />
			{text ? (
				text
			) : (
				<Wells>
					Drop
					{extensions.map(ext => (
						<Types key={`file-drop-well-${ext}`} theme={theme}>
							{ext}
						</Types>
					))}
					files here
				</Wells>
			)}
		</DropZone>
	)
})

const DropZone = styled.div<{ theme: Theme; active: boolean }>`
	cursor: pointer;
	display: flex;
	align-content: center;
	justify-content: center;
	text-align: center;
	align-items: center;
	width: 100%;
	height: 100%;
	border: 1px dashed
		${({ theme, active }) =>
			active
				? theme.application().accent().hex()
				: theme.application().lowContrast().hex()};
`

const Wells = styled.div`
	display: flex;
`

const Types = styled.span<{ theme: Theme }>`
	color: ${({ theme }) => theme.application().accent().hex()};
	font-weight: bold;
	margin-left: 4px;
	margin-right: 4px;
`
