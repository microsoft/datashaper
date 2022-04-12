/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from '@data-wrangling-components/core'
import flow from 'lodash-es/flow.js'
import { useMemo } from 'react'

import type { StepComponentProps } from '../../index.js'
import {
	selectStepComponent,
	withInputColumnDropdown,
	withInputTableDropdown,
	withOutputColumnTextfield,
	withOutputTableTextfield,
} from '../../index.js'

export function useHandleTableStepArgs(
	step: Step | undefined,
	disabled?: boolean,
): React.FC<StepComponentProps> | undefined {
	const Component = useMemo(
		() => (step ? selectStepComponent(step) : null),
		[step],
	)

	const WithAllArgs = useMemo(() => {
		if (Component) {
			return flow(
				withOutputTableTextfield(undefined, disabled),
				withOutputColumnTextfield(),
				withInputColumnDropdown(),
				withInputTableDropdown(),
			)(Component)
		}
	}, [Component, disabled])

	return WithAllArgs
}
