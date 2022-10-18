/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Workflow } from '@datashaper/workflow'
import { useObservableState } from 'observable-hooks'
import { useMemo } from 'react'
import { map } from 'rxjs'

/**
 * create a parallel array of output names for the steps
 *
 * @param workflow - The workflow instance
 * @returns
 */
export function useStepOutputs(
	workflow: Workflow,
	defaultOutputName?: (index: number) => string,
): Array<string | undefined> {
	const observable = useMemo(
		() =>
			workflow.steps$.pipe(
				map(steps =>
					steps
						.map(s => s.id)
						.map((id, index) => {
							const output = workflow.outputPorts.find(def => def.node === id)
							return output?.name ?? defaultOutputName?.(index)
						}),
				),
			),
		[workflow, defaultOutputName],
	)

	return useObservableState(observable) ?? EMPTY
}

const EMPTY: string[] = []