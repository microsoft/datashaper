/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from '@data-wrangling-components/core'
import { useCallback } from 'react'

export function useHandleRunClick(
	step: Step | undefined,
	onTransformRequested?: (step: Step) => void,
): () => void {
	return useCallback(() => {
		step && onTransformRequested?.(step)
	}, [onTransformRequested, step])
}
