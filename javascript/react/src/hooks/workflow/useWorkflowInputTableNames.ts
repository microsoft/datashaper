/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Workflow } from '@datashaper/workflow'
import { useObservableState } from 'observable-hooks'
import { useMemo } from 'react'
import { from } from 'rxjs'

/**
 * Creates a dropdown list of id-names from the tables in a store
 * TODO: for any given step, we should only show the tables created *prior* to this step,
 * potentially via an optional filter callback on store.list.
 * As it is, whenever the store is updated all the table dropdowns get the results.
 * @param workflow -
 * @returns
 */
export function useWorkflowInputTableNames(workflow?: Workflow): string[] {
	const observable = useMemo(
		() => workflow?.inputNames$ ?? from([]),
		[workflow],
	)
	return useObservableState(observable, () => [])
}
