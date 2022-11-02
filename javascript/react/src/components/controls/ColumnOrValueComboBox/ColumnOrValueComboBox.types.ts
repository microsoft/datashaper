/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IComboBoxOption, IComboBoxProps } from '@fluentui/react'

export interface ColumnOrValueComboBoxProps extends Partial<IComboBoxProps> {
	options: IComboBoxOption[]
}
