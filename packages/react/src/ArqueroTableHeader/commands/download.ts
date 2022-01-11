/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ICommandBarItemProps } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'

/**
 * Constructs a download command.
 * When clicked, will save the current table to a csv.
 * @param table
 * @param downloadFilename
 * @returns
 */
export function downloadCommand(
	table: ColumnTable,
	downloadFilename = 'download.csv',
): ICommandBarItemProps {
	const click = () => {
		// TODO: extract this to a reusable function in the utilities package
		const blob = new Blob([table.toCSV()])
		const dataURI = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = dataURI
		link.type = 'text/csv'
		link.download = downloadFilename
		link.click()
	}
	return {
		key: 'download',
		iconProps: {
			iconName: 'Download',
		},
		onClick: click,
	}
}
