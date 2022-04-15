/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from '@data-wrangling-components/core'
import type { StepComponentProps } from '@data-wrangling-components/react-verbs'
import { useMemo } from 'react'

import {
	selectStepComponent,
	withInputColumnDropdown,
	withOutputColumnTextfield,
} from '../../index.js'

export function useHandleStepArgs(
	step: Step | undefined,
	hideInputColumn?: boolean,
	hideOutputColumn?: boolean,
): React.FC<StepComponentProps> | undefined {
	const Component = useMemo(
		() => (step ? selectStepComponent(step) : null),
		[step],
	)
	const WithColumns = useMemo(() => {
		if (Component) {
			let comp = Component
			if (!hideInputColumn) {
				comp = withInputColumnDropdown()(comp)
			}
			if (!hideOutputColumn) {
				comp = withOutputColumnTextfield()(comp)
			}
			return comp
		}
	}, [Component, hideInputColumn, hideOutputColumn])

	return WithColumns
}
