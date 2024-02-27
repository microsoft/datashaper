/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/tables'
import type { Workflow } from '@datashaper/workflow'
import { useObservableState } from 'observable-hooks'
import { useMemo } from 'react'
import { from } from 'rxjs'

/**
 * @param workflow -
 * @returns
 */
export function useWorkflowInput(
	workflow?: Workflow,
): TableContainer | undefined {
	const observable = useMemo(() => workflow?.input$ ?? from([]), [workflow])
	return useObservableState(observable)
}
