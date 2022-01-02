/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IconButton } from '@fluentui/react'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'
import { useThematic } from '@thematic/react'

export interface ArqueroTableHeaderProps{
	name: string,
	numRows: number,
	numCols: number,
	downloadURL: () => {}
}

export const ArqueroTableHeader: React.FC<ArqueroTableHeaderProps> = memo(
	function ArqueroTableHeader(props) {
		const {
			name,
			numRows,
			numCols,
			downloadURL
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

		return (
            <Header>
				<H2>{name}</H2>
				<H3>{numRows} rows</H3>
				<H3>{numCols} cols</H3>
				<IconButton
					iconProps={{ iconName: 'Download' }}
					styles={buttonStyles}
					href={downloadURL}
					download={name}
					type={'text/csv'}
				/>
			</Header>
		)
	},
)

const Header = styled.div`
	height: 36px;
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