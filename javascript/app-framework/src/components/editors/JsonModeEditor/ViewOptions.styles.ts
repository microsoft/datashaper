/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styled from 'styled-components'

export const ViewOptionsContainer = styled.div`
	display: flex;
	justify-content: end;
	min-height: 45px;
	align-items: center;
	padding-right: 5px;
	background: ${({ theme }) => theme.palette.neutralLighter};
	border-bottom: 1px solid ${({ theme }) => theme.palette.neutralTertiaryAlt};
`

export const icons = {
	rawFile: { iconName: 'CodeEdit' },
	interactive: { iconName: 'PreviewLink' },
}
