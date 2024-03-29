/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { WorkflowSchema } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import { Workflow } from '@datashaper/workflow'
import type { ICommandBarItemProps } from '@fluentui/react'
import { useCallback, useMemo } from 'react'

import {
	useDownloadCsv,
	useDownloadWorkflow,
	useDownloadZip,
} from '../../hooks/downloads.js'
import {
	useHandleCsvUpload,
	useHandleJsonUpload,
	useHandleZipUpload,
} from '../../hooks/uploads.js'

export function useProjectManagementCommands(
	workflow: Workflow,
	tables: TableContainer[],
	outputTables: TableContainer[],
	itemProps: Partial<ICommandBarItemProps>,
	onUpdateWorkflowJson: (workflow: WorkflowSchema) => void,
	onUpdateTables: (tables: TableContainer[]) => void,
	onError?: (error: string) => void,
): ICommandBarItemProps[] {
	const downloadCsv = useDownloadCsv(outputTables)
	const downloadZip = useDownloadZip(workflow, tables, outputTables)
	const downloadPipeline = useDownloadWorkflow(workflow)
	const handleJsonUpload = useHandleJsonUpload(onUpdateWorkflowJson, onError)
	const handleCsvUpload = useHandleCsvUpload(onUpdateTables)
	const handleZipUpload = useHandleZipUpload(
		onUpdateWorkflowJson,
		onUpdateTables,
		onError,
	)

	const commands: ICommandBarItemProps[] = useMemo(() => {
		return [
			{
				key: 'open',
				text: 'Open',
				iconProps: icons.openFile,
				...itemProps,
				subMenuProps: {
					items: [
						{
							key: 'csv',
							text: 'CSV table',
							iconProps: icons.table,
							onClick: handleCsvUpload,
						},
						{
							key: 'json',
							text: 'Pipeline (.json)',
							iconProps: icons.code,
							onClick: handleJsonUpload,
						},
						{
							key: 'zip',
							text: 'Zip project',
							iconProps: icons.zipFolder,
							onClick: handleZipUpload,
						},
					],
				},
			},
			{
				key: 'save',
				text: 'Save',
				iconProps: icons.save,
				...itemProps,
				subMenuProps: {
					items: [
						{
							key: 'csv',
							text: 'CSV table',
							iconProps: icons.table,
							onClick: downloadCsv,
						},
						{
							key: 'json',
							text: 'Pipeline (.json)',
							iconProps: icons.code,
							onClick: downloadPipeline,
						},
						{
							key: 'zip',
							text: 'Zip project',
							iconProps: icons.zipFolder,
							onClick: downloadZip,
						},
					],
				},
			},
		] as ICommandBarItemProps[]
	}, [
		itemProps,
		downloadPipeline,
		downloadCsv,
		downloadZip,
		handleJsonUpload,
		handleCsvUpload,
		handleZipUpload,
	])

	return commands
}

export function useOnUpdateWorkflowJson(
	onUpdateWorkflow: (workflow: Workflow) => void,
): (wf: WorkflowSchema) => void {
	return useCallback(
		async (wf: WorkflowSchema) => {
			const valid = await Workflow.validate(wf)
			if (!valid) throw Error('Invalid workflow definition')
			return onUpdateWorkflow(new Workflow(wf))
		},
		[onUpdateWorkflow],
	)
}

const icons = {
	save: { iconName: 'Save' },
	openFile: { iconName: 'OpenFile' },
	table: { iconName: 'Table' },
	code: { iconName: 'Code' },
	zipFolder: { iconName: 'ZipFolder' },
}
