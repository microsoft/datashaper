/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDetailsColumnProps } from '@fluentui/react'

import type { ColumnSelectFunction } from '../index.js'

export interface DefaultColumnHeaderProps extends IDetailsColumnProps {
	onSelect?: ColumnSelectFunction
	isSortable?: boolean
	onSort?: ColumnSelectFunction
}
