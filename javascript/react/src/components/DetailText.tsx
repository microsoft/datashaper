/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styled from 'styled-components'

export interface DetailTextProps {
	text: string
	style?: React.CSSProperties
}

export const DetailText: React.FC<DetailTextProps> = memo(function DetailText({
	text,
	style,
}) {
	return <Text style={style}>{text}</Text>
})

const Text = styled.div`
	color: ${({ theme }) => theme.application().midContrast().hex()};
`
