/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Callout, DirectionalHint, IconButton } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { memo } from 'react'

import { StepEditor } from '../StepEditor/StepEditor.js'
import { useModalStyles } from '../StepEditor/StepEditor.styles.js'
import { GuidanceExpansion } from './GuidanceExpansion.js'
import { useTitle } from './StepEditorModal.hooks.js'
import {
	ContainerBody,
	Header,
	HeaderButtons,
	StepComponentContainer,
	Title,
	useIconProps,
} from './StepEditorModal.styles.js'
import type { StepEditorModalProps } from './StepEditorModal.types.js'

export const StepEditorModal: React.FC<StepEditorModalProps> = memo(
	function StepEditorModal({
		onDismiss,
		workflow,
		metadata,
		onSave,
		index,
		step,
		styles,
		...props
	}) {
		const [showGuidance, { toggle: toggleGuidance }] = useBoolean(false)
		const adaptedStyles = useModalStyles(styles)
		const title = useTitle(step)
		const icons = useIconProps()
		return (
			<Callout
				styles={adaptedStyles}
				directionalHint={DirectionalHint.rightBottomEdge}
				{...props}
			>
				<Header>
					<Title>{title}</Title>
					<HeaderButtons>
						{step?.verb ? (
							<IconButton
								onClick={toggleGuidance}
								iconProps={icons.help}
								ariaLabel="Expand verb guidance"
							/>
						) : null}
						<IconButton
							onClick={onDismiss}
							iconProps={icons.cancel}
							ariaLabel="Close verb creation modal"
						/>
					</HeaderButtons>
				</Header>
				<ContainerBody>
					<StepComponentContainer>
						<StepEditor
							hideInputColumn
							workflow={workflow}
							metadata={metadata}
							onSave={onSave}
							index={index}
							step={step}
						/>
					</StepComponentContainer>
					{showGuidance && <GuidanceExpansion verb={step?.verb} />}
				</ContainerBody>
			</Callout>
		)
	},
)
