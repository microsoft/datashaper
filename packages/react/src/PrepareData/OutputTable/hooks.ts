/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Step, TableContainer } from '@data-wrangling-components/core'
import { useMemo } from 'react'

export function useDefaultStep(output?: TableContainer): Step {
	return useMemo((): Step => {
		return {
			input: output?.name,
			output: output?.name,
		} as Step
	}, [output])
}
