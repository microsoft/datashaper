/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'
import type { ITheme } from '@fluentui/react'
import { Label } from '@fluentui/react'

export const FieldContainer = styled.div``
export const OutsideLabel = styled(Label)`
	position: absolute;
	left: 3px;
	margin-top: 10px;
`

export const Container = styled.div`
	min-width: 220px;
	max-width: 220px;
	border: 1px solid
		${({ theme }: { theme: ITheme }) => theme.palette.neutralTertiaryAlt};

	.field {
		padding: 10px;
	}
	label {
		padding-top: unset;
	}
	.field:not(:last-child) {
		border-bottom: 1px solid
			${({ theme }: { theme: ITheme }) => theme.palette.neutralTertiaryAlt};
	}
`
