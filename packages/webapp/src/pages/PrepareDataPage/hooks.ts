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
import { useBoolean } from '@fluentui/react-hooks'
import { useCallback, useEffect, useState } from 'react'
import { useLoadSpecFile } from '~pages/MainPage/hooks'

export function useBusinessLogic(): {
	setSteps: (steps: Step[]) => void
	steps: Step[]
	tables: BaseFile[]
	handleDropFiles: (loaded: BaseFile[]) => void
	onChangeSpecification: (spec: Specification) => void
	onResetSteps: () => void
	onResetFullData: () => void
} {
	const [fileCollection, setFileCollection] = useState<FileCollection>(
		new FileCollection(),
	)
	const [steps, setSteps] = useState<Step[]>([])
	const [tables, setTables] = useState<BaseFile[]>([])
	//change to files
	const updateFileCollection = useCallback(
		async (files: FileCollection) => {
			setFileCollection(files)
			setTables(files.list(FileType.table))
		},
		[setFileCollection, setTables],
	)

	useEffect(() => {
		const f = async () => {
			// const [companies, products] = await Promise.all([
			// 	loadCSV('data/companies.csv', {}),
			// 	loadCSV('data/products.csv', {}),
			// ])
			await Promise.all([
				fileCollection.add('data/companies.csv'),
				fileCollection.add('data/products.csv'),
			])
			updateFileCollection(fileCollection)

			// const steps = [
			// 	{
			// 		verb: 'join',
			// 		input: 'companies',
			// 		output: 'join-1',
			// 		args: {
			// 			other: 'products',
			// 			on: ['ID'],
			// 		},
			// 	},
			// 	{
			// 		verb: 'join',
			// 		input: 'companies',
			// 		output: 'join-2',
			// 		args: {
			// 			other: 'products',
			// 			on: ['ID', 'ID'],
			// 		},
			// 	},
			// ]
			// setSteps(steps)
		}
		f()
	}, [fileCollection, updateFileCollection])

	const handleDropFiles = useCallback(
		(loaded: BaseFile[]) => {
			loaded.forEach(async table => {
				await fileCollection.add(table)
				updateFileCollection(fileCollection)
			})
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
		// setTables([])
	}, [setSteps])

	console.log(fileCollection.list(FileType.table))
	return {
		setSteps,
		steps,
		tables,
		handleDropFiles,
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
	const [loading, { setFalse: setLoadingFalse, setTrue: setLoadingTrue }] =
		useBoolean(false)

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
				onResetFullData()
			}
			setLoadingTrue()
			await Promise.all([handleDropCSV(csv), handleDropJSON(json)])
			setLoadingFalse()
		},
		[
			handleDropCSV,
			handleDropJSON,
			setLoadingTrue,
			setLoadingFalse,
			setFileCollection,
			onResetFullData,
		],
	)

	return {
		onDrop: handleDrop,
		placeholder: 'Drop .csv, .json  or zip files here',
		acceptedFileTypes: ['.csv', '.tsv', '.json', '.zip'],
		loading: loading,
	}
}
