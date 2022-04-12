/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from '@data-wrangling-components/core'
import { readStep } from '@data-wrangling-components/core'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useEffect, useState } from 'react'

import { useFormatedColumnArgWithCount } from '../../index.js'

export function useInternalStep(
	step: Step | undefined,
	_nextInputTable = 'input',
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
		(_ev: any, opt: any) => {
			// TODO: the assumption here is that the consumer will use runPipeline
			// should we be forcing the i/o table name?
			const _step = readStep({
				verb: opt.key,
				input: step?.input as any,
				output: step?.output as any,
			})
			// merge with the previous step in case input/output columns have been controlled
			_step.args = formattedColumnArg(_step, table?.columnNames() || [])
			setInternal(_step)
		},
		[setInternal, step, formattedColumnArg, table],
	)
	return { internal, handleVerbChange, setInternal }
}
