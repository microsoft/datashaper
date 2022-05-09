/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react'

export function useStaticValue<T>(value: T): T {
	return useMemo<T>(
		() => value,
		[
			/* no deps, just static*/
		],
	)
}
