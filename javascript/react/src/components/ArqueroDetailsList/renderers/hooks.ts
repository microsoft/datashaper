/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'

export function useTextAlignStyle(
	textAlign: React.CSSProperties['textAlign'],
): React.CSSProperties {
	return useMemo(() => ({ textAlign }), [textAlign])
}
