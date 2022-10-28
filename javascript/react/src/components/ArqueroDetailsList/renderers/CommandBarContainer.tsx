/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { Container } from './CommandBarContainer.styles.js'
import type { CommandBarContainerProps } from './CommandBarContainer.types.js'
export type { CommandBarContainerProps } from './CommandBarContainer.types.js'

export const CommandBarContainer: React.FC<CommandBarContainerProps> = memo(
	function CommandBarContainer({ props, renderers }) {
		return (
			<Container className="header-command-bar">
				{renderers.map((renderer, i) => (
					<div key={i}>{renderer(props)}</div>
				))}
			</Container>
		)
	},
)
