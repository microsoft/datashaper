/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import {
	BaseFile,
	FileCollection,
	FileType,
} from '@data-wrangling-components/utilities'
import { useCallback, useEffect, useState } from 'react'

export function useBusinessLogic(): {
	setSteps: (steps: Step[]) => void
	steps: Step[]
	files: BaseFile[]
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
				fileCollection.add('data/companies2.csv'),
				fileCollection.add('data/stocks.csv'),
			])
			updateFileCollection(fileCollection)

			// const steps = [
			// 	{
			// 		verb: 'join',
			// 		input: 'companies.csv',
			// 		output: 'join-1',
			// 		args: {
			// 			other: 'products.csv',
			// 			on: ['ID'],
			// 		},
			// 	},
			// ]
			// setSteps(steps)
		}
		f()
	}, [fileCollection, updateFileCollection, setSteps])

	return {
		setSteps,
		steps,
		files,
	}
}
