/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Pipeline } from '@data-wrangling-components/core'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'

export function useRunPipeline(
	pipeline: Pipeline,
	setStoredTables?: (storedTables: Map<string, ColumnTable>) => void,
): () => Promise<void> {
	return useCallback(async () => {
		if (pipeline.steps.length) {
			await pipeline.run()
		}

		const storedTables = await pipeline.store.toMap()
		setStoredTables && setStoredTables(storedTables)
	}, [pipeline, setStoredTables])
}
