/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { default as guidanceIndex } from '@datashaper/verb-guidance'
import { MarkdownBrowser } from '@essex/components'
import { memo } from 'react'

import { Container } from './GuidanceExpansion.styles.js'
import type { GuidanceExpansionProps } from './GuidanceExpansion.types.js'

export const GuidanceExpansion: React.FC<GuidanceExpansionProps> = memo(
	function GuidanceExpansion({ verb }) {
		return verb ? (
			<Container>
				<MarkdownBrowser home={verb} content={guidanceIndex} />
			</Container>
		) : null
	},
)
