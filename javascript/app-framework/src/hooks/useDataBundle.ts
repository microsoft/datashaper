/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataBundle } from '@datashaper/workflow'

import { useDataBundles } from '../index.js'

export function useDataBundle(
	name: string | undefined,
): DataBundle | undefined {
	const bundles = useDataBundles()
	return bundles.find(t => t.name === name)
}
