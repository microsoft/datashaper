/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableBundle } from '@datashaper/workflow'

import { useTableBundles } from '../index.js'

export function useTableBundle(
	name: string | undefined,
): TableBundle | undefined {
	const bundles = useTableBundles()
	return bundles.find((t) => t.name === name)
}
