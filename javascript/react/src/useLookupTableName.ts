/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step, TableContainer } from '@data-wrangling-components/core'
import cloneDeep from 'lodash-es/cloneDeep'
import { useMemo } from 'react'

export function useLookupTableName(
	step: Step,
	tables?: TableContainer[],
): Step<unknown> {
	return useMemo((): Step<unknown> => {
		const _step = cloneDeep(step)
		_step.input = tables?.find(x => x.id === step.input)?.name || ''
		_step.output = tables?.find(x => x.id === step.output)?.name || ''
		const args = _step.args as Record<string, unknown>
		Object.keys(args).forEach(arg => {
			if (arg === 'other') {
				args[arg] = tables?.find(x => x.id === args[arg])?.name || ''
			} else if (arg === 'others') {
				args[arg] = (args[arg] as Array<any>).map(
					ar => tables?.find(x => x.id === ar)?.name || '',
				)
			}
		})
		return _step
	}, [step, tables])
}
