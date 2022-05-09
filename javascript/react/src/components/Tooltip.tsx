/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import { useBoolean, useId } from '@fluentui/react-hooks'
import { memo } from 'react'

import { Guidance } from './Guidance.jsx'
import { Callout,Container, icons } from './Tooltip.styles.js'
import type { TooltipProps } from './Tooltip.types.js'

export const Tooltip: React.FC<TooltipProps> = memo(function Tooltip({
	name = '',
	index,
}) {
	const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] =
		useBoolean(false)
	const buttonId = useId('callout-button')
	const labelId = useId('callout-label')
	const descriptionId = useId('callout-description')
	return (
		<Container>
			<IconButton
				id={buttonId}
				iconProps={icons.info}
				aria-label="Info Emoji"
				onClick={toggleIsCalloutVisible}
			/>
			{isCalloutVisible && (
				<Callout
					ariaLabelledBy={labelId}
					ariaDescribedBy={descriptionId}
					gapSpace={0}
					target={`#${buttonId}`}
					onDismiss={toggleIsCalloutVisible}
					setInitialFocus
					calloutMaxHeight={450}
				>
					<Guidance name={name} index={index} />
				</Callout>
			)}
		</Container>
	)
})
