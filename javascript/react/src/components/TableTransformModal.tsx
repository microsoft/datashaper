/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Maybe,Verb } from '@datashaper/core'
import { default as guidanceIndex } from '@datashaper/verb-guidance'
import { Callout, DirectionalHint, IconButton } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { memo, useState } from 'react'

import { Guidance } from './Guidance.js'
import { TableTransform } from './TableTransform.js'
import { useModalStyles } from './TableTransformModal.hooks.js'
import {
	ContainerBody,
	GuidanceContainer,
	Header,
	icons,
	StepComponentContainer,
	Title,
} from './TableTransformModal.styles.js'
import type { TransformModalProps } from './TableTransformModal.types.js'

export const TableTransformModal: React.FC<TransformModalProps> = memo(
	function TableTransformModal({
		onDismiss,
		graph,
		onTransformRequested,
		index,
		step,
		nextInputTable,
		styles,
		...props
	}) {
		const [verb, setVerb] = useState<Maybe<Verb>>()
		const [showGuidance, { toggle: toggleGuidance }] = useBoolean(false)
		const adaptedStyles = useModalStyles(styles, showGuidance)

		return (
			<Callout
				styles={adaptedStyles}
				directionalHint={DirectionalHint.rightBottomEdge}
				{...props}
			>
				<Header>
					<Title>{step ? 'Edit step' : 'New step'}</Title>
					{onDismiss && (
						<IconButton
							iconProps={icons.cancel}
							ariaLabel="Close popup modal"
							onClick={() => onDismiss()}
						/>
					)}
				</Header>
				<ContainerBody showGuidance={showGuidance}>
					<StepComponentContainer>
						<TableTransform
							graph={graph}
							onTransformRequested={onTransformRequested}
							index={index}
							step={step}
							showGuidance={showGuidance}
							toggleGuidance={toggleGuidance}
							showGuidanceButton={true}
							nextInputTable={nextInputTable}
							onVerbChange={setVerb}
						/>
					</StepComponentContainer>
					{showGuidance && verb ? (
						<GuidanceContainer>
							<Guidance name={verb} index={guidanceIndex} />
						</GuidanceContainer>
					) : null}
				</ContainerBody>
			</Callout>
		)
	},
)
