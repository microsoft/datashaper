/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { GraphManager } from '@data-wrangling-components/core'
import type { TableContainer } from '@essex/arquero'
import { useCallback, useEffect } from 'react'

export function useRunPipeline(
	pipeline: GraphManager,
	setSelectedTableName?: (name: string) => void,
	setSelectedTable?: (table: TableContainer | undefined) => void,
): () => Promise<void> {
	useEffect(() => {
		if (pipeline.spec.steps.length) {
			const lastStepId = pipeline.spec.steps[pipeline.spec.steps.length - 1]?.id
			if (lastStepId) {
				pipeline.output(lastStepId).subscribe(table => {
					setSelectedTableName?.(lastStepId)
					setSelectedTable?.(table)
				})
			}
		}
	}, [pipeline.spec.steps])
	return useCallback(async () => {
		// todo: delete me
	}, [])
}
