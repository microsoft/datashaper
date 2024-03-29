/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'
import { Label, TextField } from '@fluentui/react'

import { narrowDropdownStyles } from '../styles.js'

export const Container = styled.div`
	display: flex;
	flex-direction: column;
`

export const leftStyles = {
	root: {
		...narrowDropdownStyles.root,
		marginRight: 12,
	},
}

export const TextValue = styled(TextField as any)`
	display: inline;
`

export const OrLabel = styled(Label as any)`
	display: inline;
	padding-left: 10px;
	padding-right: 10px;
`
