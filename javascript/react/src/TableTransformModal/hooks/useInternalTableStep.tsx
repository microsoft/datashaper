/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step, GraphManager, Verb } from '@data-wrangling-components/core'
import { readStep } from '@data-wrangling-components/core'
import { useCallback, useEffect, useState } from 'react'

import {
	useCreateTableName,
	useFormattedColumnArg,
} from '../../common/index.js'

export function useInternalTableStep(
	step: Step | undefined,
	_lastOutput: string | undefined,
	graph: GraphManager,
): {
	internal: Step | undefined
	handleVerbChange: (verb: Verb) => void
	setInternal: (step?: Step) => void
} {
	const [internal, setInternal] = useState<Step | undefined>()
	const formattedColumnArg = useFormattedColumnArg()

	useEffect(() => {
		if (step) {
			setInternal(step)
		}
	}, [step, setInternal])

	const newTableName = useCreateTableName(graph)

	const handleVerbChange = useCallback(
		(verb: Verb) => {
			const id = newTableName(verb)
			const _step = readStep({ verb, id })
			_step.args = formattedColumnArg(_step.args)
			setInternal(_step)
		},
		[setInternal, formattedColumnArg, newTableName],
	)

	return { internal, handleVerbChange, setInternal }
}
