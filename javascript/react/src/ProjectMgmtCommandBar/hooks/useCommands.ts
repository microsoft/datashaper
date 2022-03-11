/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step, TableContainer } from '@data-wrangling-components/core'
import type { ICommandBarItemProps } from '@fluentui/react'
import { useMemo } from 'react'

import {
	useDownloadCsv,
	useDownloadPipeline,
	useDownloadZip,
} from './useDownloadFile.js'
import {
	useHandleCsvUpload,
	useHandleJsonUpload,
	useHandleZipUpload,
} from './useHandleFileUpload.js'

export function useProjectMgmtCommands(
	steps: Step[],
	tables: TableContainer[],
	outputTable?: TableContainer,
	onUpdateSteps?: (steps: Step[]) => void,
	onUpdateTables?: (tables: TableContainer[]) => void,
): ICommandBarItemProps[] {
	const downloadPipeline = useDownloadPipeline(steps)
	const downloadCsv = useDownloadCsv(outputTable)
	const downloadZip = useDownloadZip(steps, tables, outputTable)
	const handleJsonUpload = useHandleJsonUpload(onUpdateSteps)
	const handleCsvUpload = useHandleCsvUpload(onUpdateTables)
	const handleZipUpload = useHandleZipUpload(onUpdateSteps, onUpdateTables)

	const commands: ICommandBarItemProps[] = useMemo(() => {
		return [
			{
				key: 'open',
				text: 'Open',
				iconProps: { iconName: 'OpenFile' },
				subMenuProps: {
					items: [
						{
							key: 'csv',
							text: 'CSV table',
							iconProps: { iconName: 'Table' },
							onClick: handleCsvUpload,
						},
						{
							key: 'json',
							text: 'Pipeline (.json)',
							iconProps: { iconName: 'Code' },
							onClick: handleJsonUpload,
						},
						{
							key: 'zip',
							text: 'Zip project',
							iconProps: { iconName: 'ZipFolder' },
							onClick: handleZipUpload,
						},
					],
				},
			},
			{
				key: 'save',
				text: 'Save',
				iconProps: { iconName: 'Save' },
				subMenuProps: {
					items: [
						{
							key: 'csv',
							text: 'CSV table',
							iconProps: { iconName: 'Table' },
							onClick: downloadCsv,
						},
						{
							key: 'json',
							text: 'Pipeline (.json)',
							iconProps: { iconName: 'Code' },
							onClick: downloadPipeline,
						},
						{
							key: 'zip',
							text: 'Zip project',
							iconProps: { iconName: 'ZipFolder' },
							onClick: downloadZip,
						},
					],
				},
			},
		] as ICommandBarItemProps[]
	}, [
		downloadPipeline,
		downloadCsv,
		downloadZip,
		handleJsonUpload,
		handleCsvUpload,
		handleZipUpload,
	])

	return commands
}
