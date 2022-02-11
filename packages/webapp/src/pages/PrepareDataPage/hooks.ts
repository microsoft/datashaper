/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, TableContainer } from '@data-wrangling-components/core'
import { DropzoneProps } from '@data-wrangling-components/react'
import {
	BaseFile,
	FileCollection,
	FileType,
	FileWithPath,
	isZipFile,
} from '@data-wrangling-components/utilities'
import { loadCSV } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useEffect, useState } from 'react'
import { useLoadSpecFile, useLoadTableFiles } from '~pages/MainPage/hooks'

export function useBusinessLogic(): {
	setSteps: (steps: Step[]) => void
	steps: Step[]
	tables: TableContainer[]
	handleDropFiles: (loaded: Map<string, ColumnTable>) => void
} {
	const [tables, setTables] = useState<TableContainer[]>([])
	const [steps, setSteps] = useState<Step[]>([])

	useEffect(() => {
		const f = async () => {
			const [companies, products] = await Promise.all([
				loadCSV('data/companies.csv', {}),
				loadCSV('data/products.csv', {}),
			])

			const tablesList = [
				{
					name: 'companies',
					table: companies,
				},
				{
					name: 'companie2s',
					table: companies,
				},
				{
					name: 'products',
					table: products,
				},
			] as TableContainer[]
			setTables(tablesList)

			const steps = [
				{
					verb: 'join',
					input: 'companies',
					output: 'join-1',
					args: {
						other: 'products',
						on: ['ID'],
					},
				},
				{
					verb: 'join',
					input: 'companies',
					output: 'join-2',
					args: {
						other: 'products',
						on: ['ID', 'ID'],
					},
				},
			]
			setSteps(steps)
		}
		f()
	}, [])

	const handleDropFiles = useCallback(
		(loaded: Map<string, ColumnTable>) => {
			loaded.forEach((table, name) => {
				setTables(prev => [...prev, { name, table }])
			})
		},
		[setTables],
	)

	return {
		setSteps,
		steps,
		tables,
		handleDropFiles,
	}
}

export function useDropzoneProps(
	handleDropFiles: (loaded: Map<string, ColumnTable>) => void,
): DropzoneProps {
	//TODO: move to shared hook file
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
		async (files: BaseFile[]) => {
			if (!files.length) return
			updateFileCollection(files)
			const loaded = await loadFiles(files)
			handleDropFiles && handleDropFiles(loaded)
		},
		[handleDropFiles, loadFiles, updateFileCollection],
	)

	const handleDropJSON = useCallback(
		async (files: BaseFile[]) => {
			// ignore any after the first. I suppose we could auto-link the steps, but that's dangerous
			const first = files[0]
			if (!first) return
			updateFileCollection([first])
			const spec = await loadSpec(first)
			// onSelectSpecification && onSelectSpecification(spec)
		},
		[loadSpec, updateFileCollection],
	)

	const handleDrop = useCallback(
		(fileCollection: FileCollection) => {
			const csv = fileCollection.list(FileType.csv)
			const json = fileCollection.list(FileType.json)
			handleDropCSV(csv)
			handleDropJSON(json)
		},
		[handleDropCSV, handleDropJSON],
	)

	// const handleDropZip = useCallback(
	// 	async (fileCollection: FileCollection) => {
	// 		setFileCollection(fileCollection)
	// 		handleDropCSV(fileCollection)
	// 		// handleDropJSON(fileCollection)
	// 	},
	// 	[handleDropCSV, setFileCollection],
	// )

	const props = {
		onDrop: handleDrop,
		placeholder: 'Drop .csv, .json  or zip files here',
		acceptedFileTypes: ['.csv', '.tsv', '.json', '.zip'],
	} as DropzoneProps

	return props
}
