/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from '@data-wrangling-components/core'
import { useCallback } from 'react'

export function useHandleDismiss(
	onDismiss: (() => void) | undefined,
	setInternal: (step: Step | undefined) => void,
): () => void {
	return useCallback(() => {
		setInternal(undefined)
		onDismiss && onDismiss()
	}, [onDismiss, setInternal])
}
