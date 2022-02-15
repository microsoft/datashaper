/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	Step,
	Verb,
	factory,
	TableStore,
} from '@data-wrangling-components/core'
import { useState, useEffect, useCallback } from 'react'

function useCreateTableName(verifyTableName: (name: string) => boolean) {
	return useCallback(
		(name: string): string => {
			let derivedName = name
			let count = 1
			while (verifyTableName(derivedName)) {
				derivedName = `${name} (${count})`
				count++
			}
			return derivedName
		},
		[verifyTableName],
	)
}

function formatArgs(stepArgs: unknown): unknown {
	const args = stepArgs as Record<string, unknown>
	Object.keys(args).find(x => {
		if (x === 'to') args[x] = 'New column'
	})
	return args
}

export function useInternalStep(
	step: Step | undefined,
	lastOutput: string | undefined,
	stepsLength: number,
	store: TableStore,
): {
	internal: Step | undefined
	handleVerbChange: (verb: Verb) => void
	setInternal: (step?: Step) => void
} {
	const [internal, setInternal] = useState<Step | undefined>()

	useEffect(() => {
		if (step) {
			setInternal(step)
		}
	}, [step, setInternal])

	const verifyTableName = useCallback(
		(name: string): boolean => {
			return store.list().includes(name)
		},
		[store],
	)

	const newTableName = useCreateTableName(verifyTableName)

	const handleVerbChange = useCallback(
		(verb: Verb) => {
			const _step = factory(
				verb,
				lastOutput ?? '',
				newTableName(`table-${verb}`),
			)

			_step.args = formatArgs(_step.args)
			setInternal(_step)
		},
		[lastOutput, stepsLength, setInternal, newTableName],
	)

	return { internal, handleVerbChange, setInternal }
}
