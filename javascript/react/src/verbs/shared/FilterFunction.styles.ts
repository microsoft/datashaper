/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'
import { Label, TextField, Toggle } from '@fluentui/react'

import { narrowDropdownStyles } from '../../styles.js'

export const Container = styled.div`
	display: flex;
	flex-direction: column;
`

export const SideBySide = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: flex-end;
`

export const leftStyles = {
	root: {
		...narrowDropdownStyles.root,
		marginRight: 12,
	},
}

export const TextValue = styled(TextField)`
	display: inline;
`

export const OrLabel = styled(Label)`
	display: inline;
	padding-left: 10px;
	padding-right: 10px;
`

export const FilterContainer = styled.div`
	display: flex;
	justify-content: space-between;
`

export const BooleanToggle = styled(Toggle)`
	margin-top: 5px;
`

export const spinStyles = {
	root: {
		width: 120,
	},
}
