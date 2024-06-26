/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import type { ITheme } from '@fluentui/react'
import styled from 'styled-components'
import type { StepFormProps } from '../types.js'

/**
 * Provides inputs for an ungroup step.
 */
export const NoParametersFormBase: React.FC<StepFormProps<void>> = memo(
	function NoParametersFormBase() {
		return <Container>(No additional parameters needed)</Container>
	},
)

const Container = styled.div<{ theme: ITheme }>`
	padding-top: 10px;
	color: ${({ theme }) => theme.palette.neutralTertiary};
`
