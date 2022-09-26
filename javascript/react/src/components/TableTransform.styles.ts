/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styled from '@essex/styled-components'
import type { IButtonStyles } from '@fluentui/react'

export const icons = {
	info: { iconName: 'Info' },
	checkMark: { iconName: 'CheckMark' },
	preview: { iconName: 'View' },
	duplicate: { iconName: 'DuplicateRow' },
	delete: { iconName: 'Delete' },
}

export const Container = styled.div`
	position: relative;
`

export const StepSelectorContainer = styled.div`
	margin-bottom: 8px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`

export const ButtonContainer = styled.div`
	margin-top: 10px;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	width: 100%;
`

export const SaveButtonWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
`

export const rightButtonStyles: IButtonStyles = {
	root: {
		position: 'absolute',
		right: '1rem',
	},
}
