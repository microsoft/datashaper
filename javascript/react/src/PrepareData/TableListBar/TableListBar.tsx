/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@data-wrangling-components/core'
import { ColumnarMenu } from '@data-wrangling-components/react-controls'
import { DefaultButton, Spinner, SpinnerSize } from '@fluentui/react'
import { memo } from 'react'

import { DetailText } from '../DetailText/DetailText.js'
import { useOutputPreview, useTableSelection } from './TableListBar.hooks.js'
import { ListContainer, viewButtonStyles } from './TableListBar.styles.js'

export const TableListBar: React.FC<{
	inputs: TableContainer[]
	derived: TableContainer[]
	onSelect?: (name: string) => void
	selected?: string
	loading?: boolean
}> = memo(function TableListBar({
	inputs,
	derived,
	onSelect,
	selected,
	loading,
}) {
	const { onClick } = useOutputPreview(derived, onSelect)

	const menuProps = useTableSelection(inputs, derived, selected, onSelect)

	return (
		<ListContainer>
			<ColumnarMenu {...menuProps} />
			{loading && <Spinner size={SpinnerSize.xSmall} />}
			{derived.length > 0 ? (
				<DefaultButton
					styles={viewButtonStyles}
					iconProps={iconProps}
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
})

const iconProps = { iconName: 'View' }
