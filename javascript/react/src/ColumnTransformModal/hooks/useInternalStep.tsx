/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from '@data-wrangling-components/core'
import { factory } from '@data-wrangling-components/core'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useState, useEffect, useCallback } from 'react'
import { useFormatedColumnArgWithCount } from '../../index.js'

export function useInternalStep(
	step: Step | undefined,
	nextInputTable = 'input',
	table?: ColumnTable,
): {
	internal: Step | undefined
	handleVerbChange: (_ev: any, opt: any) => void
	setInternal: (step?: Step) => void
} {
	const [internal, setInternal] = useState<Step | undefined>()
	const formattedColumnArg = useFormatedColumnArgWithCount()

	useEffect(() => {
		if (step) {
			setInternal(step)
		}
	}, [step, setInternal])

	const handleVerbChange = useCallback(
		async (_ev: any, opt: any) => {
			// TODO: the assumption here is that the consumer will use runPipeline
			// should we be forcing the i/o table name?
			const inputTable = step?.input ?? nextInputTable
			const outputTable = step?.output ?? nextInputTable
			const _step = factory(opt.key, inputTable, outputTable)
			// merge with the previous step in case input/output columns have been controlled
			_step.args = await formattedColumnArg(_step, table?.columnNames() || [])
			setInternal(_step)
		},
		[setInternal, step, formattedColumnArg, nextInputTable, table],
	)
	return { internal, handleVerbChange, setInternal }
}
