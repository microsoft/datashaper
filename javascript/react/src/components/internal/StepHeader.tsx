/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import {
	Container,
	Details,
	Index,
	Verb as VerbContainer,
} from './StepHeader.styles.js'
import type { StepHeaderProps } from './StepHeader.types.js'
import { deriveDetails } from './StepHeader.utils.js'

export const StepHeader: React.FC<StepHeaderProps> = memo(function StepHeader({
	step,
	index,
	styles,
}) {
	const columns = deriveDetails(step)
	return (
		<Container style={styles?.root}>
			<Index style={styles?.index}>#{index + 1}</Index>
			<VerbContainer style={styles?.verb}>{step.verb}</VerbContainer>
			<Details style={styles?.details}>{columns}</Details>
		</Container>
	)
})
