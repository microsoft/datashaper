/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Profile } from '@datashaper/schema/dist/Profile.js'
import type { DataTable } from '@datashaper/workflow'
import type {
	ICommandBarItemProps,
	IContextualMenuItem,
	ITheme,
} from '@fluentui/react'

import { icons } from './FileTree.styles.js'
import type { FileDefinition, ResourceTreeData } from './FileTree.types.js'

function generateKey({
	table,
	resource,
}: {
	table: string
	resource: Profile
}): string {
	return `table.${resource}|${table}`
}

/**
 * Get a listing of the table packages with hierarchical resources.
 */
export function groupTables(tables: DataTable[]): ResourceTreeData[] {
	const result: ResourceTreeData[] = []

	tables.forEach(table => {
		const children: ResourceTreeData[] = []
		if (table.data != null) {
			children.push(resourceNode(table))
			children.push(datasourceNode(table))
		}
		if (table.codebook.fields.length > 0) {
			children.push(codebookNode(table))
		}
		if (table.workflow.length > 0) {
			children.push(workflowNode(table))
		}

		result.push(bundleNode(table, children))
	})
	return result
}

function resourceNode(table: DataTable): ResourceTreeData {
	return {
		key: generateKey({
			table: table.name,
			resource: 'datasource',
		}),
		title: `${table.name}.${table.format}`,
		icon: 'Database',
	}
}

function datasourceNode(table: DataTable): ResourceTreeData {
	return {
		key: generateKey({
			table: table.name,
			resource: 'source',
		}),
		title: 'datatable.json',
		icon: 'PageData',
	}
}

function workflowNode(table: DataTable): ResourceTreeData {
	return {
		key: generateKey({
			table: table.name,
			resource: 'workflow',
		}),
		icon: 'SetAction',
		title: 'workflow.json',
	}
}

function codebookNode(table: DataTable): ResourceTreeData {
	return {
		key: generateKey({
			table: table.name,
			resource: 'codebook',
		}),
		icon: 'FormLibraryMirrored',
		title: 'codebook.json',
	}
}

function bundleNode(
	table: DataTable,
	children: ResourceTreeData[],
): ResourceTreeData {
	return {
		key: generateKey({
			table: table.name,
			resource: 'bundle',
		}),
		icon: 'ViewAll',
		title: table.name,
		children,
	}
}

export function openProps(
	examples: FileDefinition[],
	onClickExample: (example: FileDefinition) => void,
	onClickUploadTable: () => void,
	onClickUploadZip: () => void,
): IContextualMenuItem[] {
	const result: IContextualMenuItem[] = [
		{
			key: 'csv',
			text: 'CSV File',
			iconProps: icons.table,
			onClick: onClickUploadTable,
		},
		{
			key: 'zip',
			text: 'Project',
			iconProps: icons.project,
			onClick: onClickUploadZip,
		},
	]
	if (examples.length > 0) {
		result.push({
			key: 'examples',
			text: 'Example',
			subMenuProps: {
				items: examples.map(example => ({
					key: example.name,
					text: example.name,
					onClick: () => onClickExample(example),
				})),
			},
		})
	}
	return result
}

export function saveProps(
	onClickDownloadZip: () => void,
): IContextualMenuItem[] {
	return [
		{
			key: 'project',
			text: 'Project',
			iconProps: icons.project,
			onClick: onClickDownloadZip,
		},
	]
}

export function createCommandBar(
	expanded: boolean,
	hasDataPackages: boolean,
	openProps: IContextualMenuItem[],
	saveProps: IContextualMenuItem[],
	theme: ITheme,
): ICommandBarItemProps[] {
	return [
		{
			key: 'open',
			text: expanded ? 'Open' : null,
			iconProps: icons.openFile,
			iconOnly: !expanded,
			subMenuProps: {
				items: openProps,
			},
			buttonStyles: {
				root: {
					background: theme.palette.neutralLighter,
				},
			},
		},
		{
			key: 'save',
			text: expanded ? 'Save' : null,
			iconProps: icons.save,
			iconOnly: !expanded,
			disabled: !hasDataPackages,
			subMenuProps: {
				items: saveProps,
			},
			buttonStyles: {
				root: {
					background: theme.palette.neutralLighter,
				},
			},
		},
	] as ICommandBarItemProps[]
}
