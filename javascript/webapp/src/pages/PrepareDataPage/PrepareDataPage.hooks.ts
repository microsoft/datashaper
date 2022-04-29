/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import type { Step} from '@data-wrangling-components/core'
import type { TableContainer } from '@essex/arquero'
import { useCallback, useState } from 'react'

export function useTables() {
	const [tables, setTables] = useState<TableContainer[]>([])

	const onAddTables = useCallback((update: TableContainer[]) => {
		setTables(prev => [...prev, ...update])
	}, [setTables])

	const [output, onUpdateOutput] = useState<TableContainer | undefined>()
	return {
		tables,
		onAddTables,
		output,
		onUpdateOutput
	}
}

export function useSteps() {
	const [steps, setSteps] = useState<Step[]>([])

	const onUpdateSteps = useCallback((update: Step[]) => setSteps(prev => [...prev, ...update]), [setSteps])
	return {
		steps,
		onUpdateSteps
	}
}
