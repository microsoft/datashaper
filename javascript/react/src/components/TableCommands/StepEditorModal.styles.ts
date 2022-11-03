/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styled from '@essex/styled-components'

export const icons = {
	cancel: { iconName: 'Cancel' },
	info: { iconName: 'Info' },
}

const MAX_HEIGHT = 700

export const ContainerBody = styled.div`
	padding: 0px 12px 14px 24px;
	display: flex;
	justify-content: flex-start;
`

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: ${({ theme }) => theme.palette.neutralLighter};
	margin-bottom: 12px;
`

export const Title = styled.h3`
	padding-left: 12px;
	margin: 8px 0 8px 0;
`

export const StepComponentContainer = styled.div`
	width: 300px;
	max-height: ${MAX_HEIGHT}px;
	overflow: hidden auto;
`

export const GuidanceContainer = styled.div`
	width: 400px;
	max-height: ${MAX_HEIGHT - 20}px;
	overflow: hidden auto;
`
