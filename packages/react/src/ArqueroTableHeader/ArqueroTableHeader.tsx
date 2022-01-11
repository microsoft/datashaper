/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IconButton } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import ColumnTable from 'arquero/dist/types/table/column-table'
import React, { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

export interface ArqueroTableHeaderProps {
	name?: string
	showRowCount?: boolean
	showColumnCount?: boolean
	allowDownload?: boolean
	downloadFilename?: string
	table: ColumnTable
}

export const ArqueroTableHeader: React.FC<ArqueroTableHeaderProps> = memo(
	function ArqueroTableHeader(props) {
		const {
			name,
			showRowCount = true,
			showColumnCount = true,
			allowDownload = false,
			downloadFilename = 'download.csv',
			table,
		} = props

		const theme = useThematic()

		const buttonStyles = useMemo(
			() => ({
				root: {
					color: theme.application().background().hex(),
				},
			}),
			[theme],
		)

		const handleDownloadClick = useCallback(() => {
			// TODO: extract this to a reusable function in the utilities package
			const blob = new Blob([table.toCSV()])
			const dataURI = URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = dataURI
			link.type = 'text/csv'
			link.download = downloadFilename
			link.click()
		}, [table, downloadFilename])

		return (
			<Header>
				{name ? <H2>{name}</H2> : null}
				{showRowCount === true ? <H3>{table.numRows()} rows</H3> : null}
				{showColumnCount === true ? <H3>{table.numCols()} cols</H3> : null}
				{allowDownload === true ? (
					<IconButton
						iconProps={{ iconName: 'Download' }}
						styles={buttonStyles}
						onClick={handleDownloadClick}
					/>
				) : null}
			</Header>
		)
	},
)

const Header = styled.div`
	height: 36px;
	width: 100%;
	display: flex;
	justify-content: space-around;
	align-items: center;
	background-color: ${({ theme }) => theme.application().accent().hex()};
`

const H2 = styled.h3`
	font-weight: normal;
	font-size: 0.8em;
	margin-right: 8px;
	color: ${({ theme }) => theme.application().background().hex()};
`

const H3 = styled.h3`
	font-weight: normal;
	font-size: 0.8em;
	margin-right: 8px;
	color: ${({ theme }) => theme.application().background().hex()};
`
