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
		return _step
	}, [step, tables])
}
