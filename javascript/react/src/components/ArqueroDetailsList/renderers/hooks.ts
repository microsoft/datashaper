/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type React from 'react'
import { useMemo } from 'react'

export function useTextAlignStyle(
	textAlign: React.CSSProperties['textAlign'],
	// any other override styles a cell needs
	overrides?: React.CSSProperties,
): React.CSSProperties {
	return useMemo(() => ({ textAlign, ...overrides }), [textAlign, overrides])
}
