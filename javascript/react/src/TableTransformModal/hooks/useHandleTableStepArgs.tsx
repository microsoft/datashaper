/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from '@data-wrangling-components/core'
import { useMemo } from 'react'
import {
	StepComponentProps,
	selectStepComponent,
	withInputTableDropdown,
	withOutputColumnTextfield,
	withInputColumnDropdown,
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
			return withInputTableDropdown()(
				withOutputColumnTextfield()(
					withInputColumnDropdown()(
						withOutputTableTextfield(undefined, disabled)(Component),
					),
				),
			)
		}
	}, [Component, disabled])

	return WithAllArgs
}
