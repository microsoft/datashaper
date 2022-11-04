/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { default as guidanceIndex } from '@datashaper/verb-guidance'
import { memo } from 'react'

import { Guidance } from '../Guidance/Guidance.js'
import { Container } from './GuidanceButton.styles.js'
import type { GuidanceButtonProps } from './GuidanceButton.types.js'

export const GuidanceButton: React.FC<GuidanceButtonProps> = memo(
	function GuidanceButton({ verb }) {
		return verb ? (
			<Container>
				<Guidance name={verb} index={guidanceIndex} />
			</Container>
		) : null
	},
)
