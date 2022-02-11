/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { download } from '@data-wrangling-components/utilities'
import { ICommandBarItemProps } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'
import merge from 'lodash/merge.js'
/**
 * Constructs a download command.
 * When clicked, will save the current table to a csv.
 * @param table
 * @param downloadFilename
 * @returns
 */
export function downloadCommand(
	table: ColumnTable,
	downloadFilename?: string,
	props?: Partial<ICommandBarItemProps>,
): ICommandBarItemProps {
	return merge(
		{},
		{
			key: 'download',
			title: 'Download table',
			iconProps: {
				iconName: 'Download',
			},
			onClick: () => download(table, downloadFilename),
		},
		props,
	)
}
