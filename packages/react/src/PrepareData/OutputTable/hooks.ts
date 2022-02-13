/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Step } from '@data-wrangling-components/core'
import { useMemo } from 'react'

export function useDefaultStep(lastTableName?: string): Step {
	return useMemo((): Step => {
		return {
			input: lastTableName,
			output: lastTableName,
		} as Step
	}, [lastTableName])
}
