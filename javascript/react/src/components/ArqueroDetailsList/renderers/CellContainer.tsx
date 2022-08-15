/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'
import type { IColumn } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'

import type { ColumnClickFunction } from '../index.js'

interface CellContainerProps {
	onClick?: ColumnClickFunction
	column?: IColumn
}

export const CellContainer: React.FC<
	React.PropsWithChildren<CellContainerProps>
> = memo(function CellContainer({ onClick, column, children }) {
	const handleColumnClick = useCallback(
		(ev: React.MouseEvent<HTMLElement, MouseEvent>) => {
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
})

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
