/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/workflow'
import { memo, useMemo } from 'react'

import { EMPTY_ARRAY } from '../empty.js'
import type { StepDescriptionProps } from '../types.js'
import { createRowEntries } from '../verbForm/createRowEntries.js'
import { VerbDescription } from '../verbForm/VerbDescription.js'

export const SetOperationDescription: React.FC<StepDescriptionProps<void>> =
	memo(function SetOperationDescription(props) {
		const rows = useMemo(() => {
			const internal = props.step as Step
			const others = otherInputNames(internal)
			const sub = createRowEntries(others, o => ({ value: o }), 1, props)
			return [
				{
					before: 'with',
					value: others.length > 0 ? '' : null,
					sub,
				},
			]
		}, [props])
		return <VerbDescription {...props} rows={rows} />
	})
export function otherInputNames(step: Step): string[] {
	return (step.input.others || EMPTY_ARRAY).map(i => i.node)
}
