/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Workflow } from '@datashaper/workflow'
import { useObservableState } from 'observable-hooks'

import { EMPTY_ARRAY } from '../../empty.js'

/**
 * create a parallel array of output names for the steps
 *
 * @param workflow - The workflow instance
 * @returns
 */
export function useStepOutputs(workflow: Workflow): string[] {
	return useObservableState(workflow.outputNames$) ?? EMPTY_ARRAY
}
