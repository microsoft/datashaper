/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { Text } from './DetailText.styles.js'
import type { DetailTextProps } from './DetailText.types.js'

export const DetailText: React.FC<DetailTextProps> = memo(function DetailText({
	text,
	style,
}) {
	return <Text style={style}>{text}</Text>
})
