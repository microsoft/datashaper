/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { MarkdownBrowser } from '@essex/components'
import { memo } from 'react'

import { useGuidanceContent } from './GuidanceExpansion.hooks.js'
import { Container } from './GuidanceExpansion.styles.js'
import type { GuidanceExpansionProps } from './GuidanceExpansion.types.js'

export const GuidanceExpansion: React.FC<GuidanceExpansionProps> = memo(
	function GuidanceExpansion({ verb }) {
		const content = useGuidanceContent()
		return verb ? (
			<Container>
				<MarkdownBrowser home={verb} content={content} />
			</Container>
		) : null
	},
)
