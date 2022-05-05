/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnarMenu } from '@data-wrangling-components/react-controls'
import { DefaultButton, Spinner, SpinnerSize } from '@fluentui/react'
import { memo } from 'react'

import { DetailText } from './DetailText.js'
import { useOutputPreview, useTableSelection } from './TableListBar.hooks.js'
import {
	icons,
	ListContainer,
	viewButtonStyles,
} from './TableListBar.styles.js'
import type { TableListBarProps } from './TableListBar.types.js'

export const TableListBar: React.FC<TableListBarProps> = memo(
	function TableListBar({ inputs, derived, onSelect, selected, loading }) {
		const { onClick } = useOutputPreview(Object.values(derived), onSelect)
		const menuProps = useTableSelection(inputs, derived, selected, onSelect)

		return (
			<ListContainer>
				<ColumnarMenu {...menuProps} />
				{loading && <Spinner size={SpinnerSize.xSmall} />}
				{derived.length > 0 ? (
					<DefaultButton
						styles={viewButtonStyles}
						iconProps={icons.view}
						onClick={onClick}
					>
						View output table
					</DefaultButton>
				) : null}

				{!selected && (
					<DetailText text="Select an input or derived table to preview" />
				)}
			</ListContainer>
		)
	},
)
