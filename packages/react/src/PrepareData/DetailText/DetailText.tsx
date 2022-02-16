/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import styled from 'styled-components'

export const DetailText: React.FC<{ text: string }> = memo(function DetailText({
	text,
}) {
	return <Text>{text}</Text>
})

const Text = styled.div`
	display: flex;
	justify-content: center;
	align-self: center;
	color: ${({ theme }) => theme.application().border().hex()};
`
