/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnarMenu } from '@data-wrangling-components/react-controls'
import type { TableContainer } from '@essex/arquero'
import { DefaultButton, Spinner, SpinnerSize } from '@fluentui/react'
import { memo } from 'react'

import { DetailText } from '../DetailText/DetailText.js'
import { useOutputPreview, useTableSelection } from './TableListBar.hooks.js'
import { ListContainer, viewButtonStyles } from './TableListBar.styles.js'

export const TableListBar: React.FC<{
	/**
	 * The input tables
	 */
	inputs: TableContainer[]

	/**
	 * The output tables
	 */
	derived: TableContainer[]

	/**
	 * The table selection handler
	 */
	onSelect?: (name: string) => void

	/**
	 * The selected table id
	 */
	selected?: string

	/**
	 * The load-state
	 */
	loading?: boolean
}> = memo(function TableListBar({
	inputs,
	derived,
	onSelect,
	selected,
	loading,
}) {
	const { onClick } = useOutputPreview(Object.values(derived), onSelect)
	const menuProps = useTableSelection(inputs, derived, selected, onSelect)

	return (
		<ListContainer>
			<ColumnarMenu {...menuProps} />
			{loading && <Spinner size={SpinnerSize.xSmall} />}
			{derived.length > 0 ? (
				<DefaultButton
					styles={viewButtonStyles}
					iconProps={viewIcon}
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

const viewIcon = { iconName: 'View' }
