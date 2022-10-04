/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Verb } from '@datashaper/schema'
import { default as guidanceIndex } from '@datashaper/verb-guidance'
import type { Maybe } from '@datashaper/workflow'
import { Callout, DirectionalHint, IconButton, useTheme } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { memo, useState } from 'react'

import { Guidance } from './Guidance.js'
import { TableTransform } from './TableTransform.js'
import {
	ContainerBody,
	GuidanceContainer,
	Header,
	icons,
	StepComponentContainer,
	Title,
} from './TableTransformModal.styles.js'
import type { TransformModalProps } from './TableTransformModal.types.js'
import { getModalStyles } from './TableTransformModal.utils.js'

export const TableTransformModal: React.FC<TransformModalProps> = memo(
	function TableTransformModal({
		onDismiss,
		workflow,
		onTransformRequested,
		index,
		step,
		styles,
		...props
	}) {
		const theme = useTheme()
		const [verb, setVerb] = useState<Maybe<Verb>>(step?.verb)
		const [showGuidance, { toggle: toggleGuidance }] = useBoolean(false)
		const adaptedStyles = getModalStyles(theme, styles)

		return (
			<Callout
				styles={adaptedStyles}
				directionalHint={DirectionalHint.rightBottomEdge}
				{...props}
			>
				<Header>
					<Title>
						{step
							? `${step.verb.toUpperCase()} ${
									(step.args as any).column
										? `${(step.args as any).column}`
										: ''
							  }`
							: 'New step'}
					</Title>
					{onDismiss && (
						<IconButton
							iconProps={icons.cancel}
							ariaLabel="Close popup modal"
							onClick={() => onDismiss()}
						/>
					)}
				</Header>
				<ContainerBody>
					<StepComponentContainer>
						<TableTransform
							hideInput={props.hideInput}
							hideOutput={props.hideOutput}
							hideStepSelector={props.hideInput && props.hideOutput}
							hideInputColumn={props.hideInput && props.hideOutput}
							workflow={workflow}
							onTransformRequested={onTransformRequested}
							index={index}
							step={step}
							showGuidance={showGuidance}
							toggleGuidance={toggleGuidance}
							onVerbChange={setVerb}
							showGuidanceButton
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
