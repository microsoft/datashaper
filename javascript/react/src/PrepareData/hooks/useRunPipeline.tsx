/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Pipeline, TableContainer } from '@data-wrangling-components/core'
import { useCallback } from 'react'

export function useRunPipeline(
	pipeline: Pipeline,
	setStoredTables?: (storedTables: Map<string, TableContainer>) => void,
	setSelectedTableName?: (name: string) => void,
): () => Promise<void> {
	return useCallback(async () => {
		if (pipeline.steps.length) {
			const output = await pipeline.run()
			setSelectedTableName && setSelectedTableName(output.id)
		}
		const storedTables = await pipeline.store.toMap()
		setStoredTables && setStoredTables(storedTables)
	}, [pipeline, setStoredTables, setSelectedTableName])
}
