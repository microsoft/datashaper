/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IComboBoxOption,IComboBoxProps } from '@fluentui/react'
import { ComboBox, SelectableOptionMenuItemType } from '@fluentui/react'
import { memo, useMemo } from 'react'

import { dropdownStyles } from '../styles.js'

export interface ColumnOrValueComboBoxProps extends Partial<IComboBoxProps> {
	options: IComboBoxOption[]
}

/**
 * ComboBox that allows the user to either input a freeform value or select a column.
 * We frequently have operations where a comparison may be to a fixed value, or should
 * be dependent on per-row column values.
 */
export const ColumnOrValueComboBox: React.FC<ColumnOrValueComboBoxProps> = memo(
	function ColumnOrValueComboBox({ options, ...props }) {
		const withHeader = useMemo(() => {
			return [
				{
					key: 'header',
					text: 'Columns',
					itemType: SelectableOptionMenuItemType.Header,
				},
				...options,
			]
		}, [options])
		return (
			<ComboBox
				allowFreeform
				autoComplete={'off'}
				label={'Column or value'}
				placeholder={'text/number or select column'}
				options={withHeader}
				styles={dropdownStyles}
				{...props}
			/>
		)
	},
)
