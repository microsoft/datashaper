/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from '@data-wrangling-components/core'
import { useCallback } from 'react'

export function useHandleRunClick(
	onDismiss: () => void,
	internal: Step | undefined,
	onTransformRequested?: (internal: Step) => void,
): () => void {
	return useCallback(() => {
		if (internal) {
			onTransformRequested && onTransformRequested(internal)
			onDismiss && onDismiss()
		}
	}, [onDismiss, onTransformRequested, internal])
}
