/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import type { Step, TableContainer } from '@data-wrangling-components/core'
import { useCallback, useState } from 'react'

export function useBusinessLogic(): {
	setSteps: (steps: Step[]) => void
	steps: Step[]
	tables: TableContainer[]
	updateTables: (tables: TableContainer[]) => void
	outputTable: TableContainer | undefined
	setOutputTable: (table: TableContainer) => void
} {
	const [steps, setSteps] = useState<Step[]>([])
	const [tables, setTables] = useState<TableContainer[]>([])
	const [outputTable, setOutputTable] = useState<TableContainer>()

	const updateTables = useCallback(
		(tables: TableContainer[]) => {
			setTables((prev: TableContainer[]) =>
				!tables.length ? [] : [...prev, ...tables],
			)
		},
		[setTables],
	)

	return {
		setSteps,
		steps,
		tables,
		updateTables,
		outputTable,
		setOutputTable,
	}
}
