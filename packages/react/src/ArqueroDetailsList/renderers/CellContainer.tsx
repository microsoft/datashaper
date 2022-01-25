/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IColumn } from '@fluentui/react'
import React, { memo, useCallback, useMemo } from 'react'
import { ColumnClickFunction } from 'src'
import styled from 'styled-components'

interface CellContainerProps {
	onClick?: ColumnClickFunction
	column?: IColumn
}

export const CellContainer: React.FC<CellContainerProps> = memo(
	function CellContainer({ onClick, column, children }) {
		const handleColumnClick = useCallback(
			ev => {
				column &&
					onClick &&
					onClick(ev, column?.data?.selected ? undefined : column)
			},
			[column, onClick],
		)

		const cellStyle = useMemo(() => {
			const style: React.CSSProperties = {}

			if (onClick) {
				style.cursor = 'pointer'
			}

			if (column?.data?.selected) {
				style.fontWeight = 'bold'
			}
			return style
		}, [onClick, column])

		return (
			<Container onClick={handleColumnClick} style={cellStyle}>
				{children}
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	align-items: center;
	height: 100%;
	width: inherit;
	> * {
		&:first-child {
			padding: 6px 8px 6px 12px;
		}
	}
`
