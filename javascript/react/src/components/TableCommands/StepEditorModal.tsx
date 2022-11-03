/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Callout, DirectionalHint, IconButton, useTheme } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { memo } from 'react'

import { Action } from '../controls/index.js'
import { StepEditor } from '../StepEditor/StepEditor.js'
import { GuidanceButton } from './GuidanceButton.js'
import { useTitle } from './StepEditorModal.hooks.js'
import {
	ContainerBody,
	Header,
	icons,
	StepComponentContainer,
	Title,
} from './StepEditorModal.styles.js'
import type { StepEditorModalProps } from './StepEditorModal.types.js'
import { getModalStyles } from './StepEditorModal.utils.js'

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
		const theme = useTheme()
		const [showGuidance, { toggle: toggleGuidance }] = useBoolean(false)
		const adaptedStyles = getModalStyles(theme, styles)
		const title = useTitle(step)

		return (
			<Callout
				styles={adaptedStyles}
				directionalHint={DirectionalHint.rightBottomEdge}
				{...props}
			>
				<Header>
					<Title>{title}</Title>
					<Action
						onClick={onDismiss}
						iconProps={icons.cancel}
						ariaLabel="Close popup modal"
					/>
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
					{step?.verb ? (
						<IconButton
							onClick={toggleGuidance}
							iconProps={icons.info}
							checked={showGuidance}
						/>
					) : null}
					{showGuidance && <GuidanceButton verb={step?.verb} />}
				</ContainerBody>
			</Callout>
		)
	},
)
