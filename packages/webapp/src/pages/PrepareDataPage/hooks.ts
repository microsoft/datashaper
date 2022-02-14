/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Specification, Step } from '@data-wrangling-components/core'
import { DropzoneProps } from '@data-wrangling-components/react'
import {
	BaseFile,
	FileCollection,
	FileType,
	FileWithPath,
} from '@data-wrangling-components/utilities'
import { useCallback, useEffect, useState } from 'react'
import { useLoadSpecFile } from '~pages/MainPage/hooks'

export function useBusinessLogic(): {
	setSteps: (steps: Step[]) => void
	steps: Step[]
	files: BaseFile[]
	handleDropFiles: (loaded: BaseFile[]) => void
	handleDeleteFile: (name: string) => void
	onChangeSpecification: (spec: Specification) => void
	onResetSteps: () => void
	onResetFullData: () => void
} {
	const [fileCollection, setFileCollection] = useState<FileCollection>(
		new FileCollection(),
	)
	const [steps, setSteps] = useState<Step[]>([])
	const [files, setFiles] = useState<BaseFile[]>([])

	const updateFileCollection = useCallback(
		(collection: FileCollection) => {
			setFileCollection(collection)
			setFiles(collection.list(FileType.table))
		},
		[setFileCollection, setFiles],
	)

	useEffect(() => {
		const f = async () => {
			await Promise.all([
				fileCollection.add('data/companies.csv'),
				fileCollection.add('data/products.csv'),
			])
			updateFileCollection(fileCollection)
		}
		f()
	}, [fileCollection, updateFileCollection])

	const handleDropFiles = useCallback(
		(_files: BaseFile[]) => {
			_files.forEach(async file => {
				await fileCollection.add(file)
				updateFileCollection(fileCollection)
			})
		},
		[updateFileCollection, fileCollection],
	)

	const handleDeleteFile = useCallback(
		(name: string) => {
			fileCollection.remove({ name })
			updateFileCollection(fileCollection)
		},
		[updateFileCollection, fileCollection],
	)

	const onChangeSpecification = useCallback(
		(specification: Specification) => {
			specification.steps && setSteps(specification?.steps)
		},
		[setSteps],
	)

	const onResetSteps = useCallback(() => {
		setSteps([])
	}, [setSteps])

	const onResetFullData = useCallback(() => {
		setSteps([])
		fileCollection.clear()
		updateFileCollection(fileCollection)
	}, [setSteps, fileCollection, updateFileCollection])

	return {
		setSteps,
		steps,
		files,
		handleDropFiles,
		handleDeleteFile,
		onChangeSpecification,
		onResetSteps,
		onResetFullData,
	}
}

export function useDropzoneProps(
	handleDropFiles: (loaded: BaseFile[]) => void,
	onResetSteps: () => void,
	onResetFullData: () => void,
	onChangeSpecification?: (spec: Specification) => void,
): DropzoneProps {
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
		async (files: BaseFile[]) => {
			if (!files.length) return
			await updateFileCollection(files)
			handleDropFiles && handleDropFiles(files)
		},
		[handleDropFiles, updateFileCollection],
	)

	const handleDropJSON = useCallback(
		async (files: BaseFile[]) => {
			// ignore any after the first. I suppose we could auto-link the steps, but that's dangerous
			const first = files[0]
			if (!first) return
			onResetSteps()
			updateFileCollection([first])
			const spec = await loadSpec(first)
			onChangeSpecification && onChangeSpecification(spec)
		},
		[loadSpec, updateFileCollection, onChangeSpecification, onResetSteps],
	)

	const handleDrop = useCallback(
		async (_fileCollection: FileCollection) => {
			setFileCollection(_fileCollection)
			const csv = _fileCollection.list(FileType.csv)
			const json = _fileCollection.list(FileType.json)
			if (json.length && csv.length) {
				//if both files, reset everything
				onResetFullData()
			}
			await Promise.all([handleDropCSV(csv), handleDropJSON(json)])
		},
		[handleDropCSV, handleDropJSON, setFileCollection, onResetFullData],
	)

	return {
		onDrop: handleDrop,
		placeholder: 'Drop .csv, .json  or zip files here',
		acceptedFileTypes: ['.csv', '.tsv', '.json', '.zip'],
	}
}
