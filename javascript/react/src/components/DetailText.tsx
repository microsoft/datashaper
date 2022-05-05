/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import type { DetailTextProps } from './DetailText.types.js'
import { Text } from './DetailText.styles.js'

export const DetailText: React.FC<DetailTextProps> = memo(function DetailText({
	text,
	style,
}) {
	return <Text style={style}>{text}</Text>
})
