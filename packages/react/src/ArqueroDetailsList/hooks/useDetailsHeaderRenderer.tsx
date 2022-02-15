/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDetailsHeaderProps } from '@fluentui/react'
import type { IRenderFunction } from '@fluentui/utilities'
import { useCallback } from 'react'

/**
 * Overrides the default details header rendering so we can inject customization
 * @returns
 */
export function useDetailsHeaderRenderer(): IRenderFunction<IDetailsHeaderProps> {
	return useCallback((props?, defaultRender?) => {
		if (!props || !defaultRender) {
			return null
		}
		const updated = {
			styles: {
				root: {
					// removes the excessive header padding and matches the bottom padding
					paddingTop: 1,
				},
			},
			...props,
		}
		return defaultRender(updated)
	}, [])
}
