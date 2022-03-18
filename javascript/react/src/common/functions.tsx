/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColumnMetadata } from '@data-wrangling-components/core'
import type {
	ICommandBarItemProps,
	ICommandBarProps,
	IDetailsGroupDividerProps,
} from '@fluentui/react'
import { CommandBar } from '@fluentui/react'
import type { ReactElement } from 'react'

import { GroupHeader } from '../controls/index.js'

export function createLazyLoadingGroupHeader(
	props: IDetailsGroupDividerProps | undefined,
	children: any,
	columnName?: string,
	columnMetadata?: ColumnMetadata | undefined,
): ReactElement<any, any> | null {
	if (!props || (!columnMetadata && !columnName)) {
		return null
	}
	return (
		<GroupHeader
			props={props}
			columnName={columnMetadata?.name || columnName}
			lazyLoadGroups
		>
			{children}
		</GroupHeader>
	)
}

export function createDefaultCommandBar(
	items: ICommandBarItemProps[],
	props?: ICommandBarProps | undefined,
): ReactElement<any, any> {
	const styles = {
		root: {
			height: '36px',
		},
		primarySet: {
			width: '100%',
		},
	}
	return <CommandBar styles={styles} {...props} items={items} />
}
