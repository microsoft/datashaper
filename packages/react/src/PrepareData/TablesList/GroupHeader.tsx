/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColumnMetadata } from '@data-wrangling-components/core'
import type { IDetailsGroupDividerProps, IGroup } from '@fluentui/react'
import React, { memo, useCallback } from 'react'
import styled from 'styled-components'
import { createLazyLoadingGroupHeader } from '../../common/index.js'

export function useGroupHeader(): (
	meta?: ColumnMetadata,
	props?: IDetailsGroupDividerProps,
) => any {
	return useCallback(
		(meta?: ColumnMetadata, props?: IDetailsGroupDividerProps) => {
			const custom = <GroupHeader group={props?.group} />
			return createLazyLoadingGroupHeader(props, meta, custom)
		},
		[],
	)
}

export const GroupHeader: React.FC<{
	group?: IGroup
}> = memo(function GroupHeader({ group }) {
	return (
		<Container>
			<Title>{group?.name} </Title>
			<Title>tables: {group?.count}</Title>
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	width: 100%;
	align-self: center;
	justify-content: space-between;
	color: ${({ theme }) => theme.application().accent().hex()};
`

const Title = styled.h3`
	font-weight: normal;
	margin: unset;
	margin-right: 8px;
`
