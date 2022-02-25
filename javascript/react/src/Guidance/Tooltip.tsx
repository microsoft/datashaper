/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton, Callout as FluentCallout } from '@fluentui/react'
import { useBoolean, useId } from '@fluentui/react-hooks'
import React, { memo } from 'react'
import styled from 'styled-components'
import { Guidance } from './Guidance.js'
import { GuidanceProps } from './types.js'

export const Tooltip: React.FC<GuidanceProps> = memo(function Tooltip({
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
				iconProps={{ iconName: 'Info' }}
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

const Container = styled.div``

const Callout = styled(FluentCallout)`
	.ms-Callout-main {
		width: 350px;
		padding: 1.5rem 2rem;
	}
`
