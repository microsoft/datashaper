/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useMemo } from 'react'

import { selectStepDescription } from './selectStepDescription.js'
import { Container } from './StepDescription.styles.js'
import type { StepDescriptionProps } from './StepDescription.types.js'

/**
 * Let's us render the Steps in a loop while memoizing all the functions
 */
export const StepDescription: React.FC<StepDescriptionProps> = memo(
	function StepComponent({ step, output }) {
		const Description = useMemo(() => selectStepDescription(step), [step])

		return (
			<Container>
				<Description
					step={step}
					output={output}
					showInput
					showOutput
					showOutputColumn
				/>
			</Container>
		)
	},
)
