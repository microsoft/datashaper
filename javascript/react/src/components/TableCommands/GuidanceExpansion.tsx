/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { default as guidanceIndex } from '@datashaper/verb-guidance'
import { memo } from 'react'

import { Guidance } from '../Guidance/Guidance.js'
import { Container } from './GuidanceExpansion.styles.js'
import type { GuidanceExpansionProps } from './GuidanceExpansion.types.js'

export const GuidanceExpansion: React.FC<GuidanceExpansionProps> = memo(
	function GuidanceExpansion({ verb }) {
		return verb ? (
			<Container>
				<Guidance name={verb} index={guidanceIndex} />
			</Container>
		) : null
	},
)
