/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColumnMetadata } from '@data-wrangling-components/core'
import {
	CommandBar,
	ICommandBarItemProps,
	ICommandBarProps,
	IDetailsGroupDividerProps,
} from '@fluentui/react'
import type { ReactElement } from 'react'
import { GroupHeader } from '../controls/index.js'

export function createLazyLoadingGroupHeader(
	props: IDetailsGroupDividerProps | undefined,
	columnMetadata: ColumnMetadata | undefined,
	children: any,
): ReactElement<any, any> | null {
	if (!props || !columnMetadata) {
		return null
	}
	return (
		<GroupHeader props={props} columnMeta={columnMetadata} lazyLoadGroups>
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
	}
	return <CommandBar styles={styles} {...props} items={items} />
}
