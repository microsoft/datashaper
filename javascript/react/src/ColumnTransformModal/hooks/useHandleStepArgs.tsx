/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from '@data-wrangling-components/core'
import {
	withInputColumnDropdown,
	withOutputColumnTextfield,
} from '@data-wrangling-components/react-hocs'
import type { StepComponentProps } from '@data-wrangling-components/react-types'
import { useMemo } from 'react'

import { selectStepComponent } from '../../index.js'

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
			let comp = Component as any
			if (!hideInputColumn) {
				comp = withInputColumnDropdown()(comp as any)
			}
			if (!hideOutputColumn) {
				comp = withOutputColumnTextfield()(comp as any)
			}
			return comp
		}
	}, [Component, hideInputColumn, hideOutputColumn])

	return WithColumns
}
