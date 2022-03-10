/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@data-wrangling-components/core'
import { DefaultButton } from '@fluentui/react'
import { memo } from 'react'

import { ColumnarMenu } from '../../controls/ColumnarMenu/ColumnarMenu.js'
import { DetailText } from '../DetailText/DetailText.js'
import { useOutputPreview, useTableSelection } from './TableListBar.hooks.js'
import { ListContainer, viewButtonStyles } from './TableListBar.styles.js'

export const TableListBar: React.FC<{
	inputs: TableContainer[]
	derived: TableContainer[]
	onSelect?: (name: string) => void
	selected?: string
}> = memo(function TableListBar({ inputs, derived, onSelect, selected }) {
	const { onClick } = useOutputPreview(derived, onSelect)

	const menuProps = useTableSelection(inputs, derived, selected, onSelect)

	return (
		<ListContainer>
			<ColumnarMenu {...menuProps} />
			{derived.length > 0 ? (
				<DefaultButton
					styles={viewButtonStyles}
					iconProps={iconProps}
					onClick={onClick}
				>
					View output
				</DefaultButton>
			) : null}

			{!selected && (
				<DetailText text="Select an input or derived table to preview" />
			)}
		</ListContainer>
	)
})

const iconProps = { iconName: 'View' }
