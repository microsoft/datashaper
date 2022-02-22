/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Pipeline, TableContainer } from '@data-wrangling-components/core'
import { useCallback } from 'react'

export function useRunPipeline(
	pipeline: Pipeline,
	setStoredTables?: (storedTables: Map<string, TableContainer>) => void,
): () => Promise<void> {
	return useCallback(async () => {
		if (pipeline.steps.length) {
			await pipeline.run()
		}
		const storedTables = await pipeline.store.toMap()
		setStoredTables && setStoredTables(storedTables)
	}, [pipeline, setStoredTables])
}
