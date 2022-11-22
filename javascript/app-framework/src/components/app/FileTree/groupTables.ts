/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { TableBundle } from '@datashaper/workflow'
import type {
	ICommandBarItemProps,
	IContextualMenuItem,
	ITheme,
} from '@fluentui/react'

import { icons } from './FileTree.styles.js'
import type { FileDefinition, ResourceTreeData } from './FileTree.types.js'

/**
 * Get a listing of the table packages with hierarchical resources.
 */
export function groupTables(bundles: TableBundle[]): ResourceTreeData[] {
	const result: ResourceTreeData[] = []

	bundles.forEach(table => {
		const children: ResourceTreeData[] = []
		if (table?.datatable?.data != null) {
			children.push(resourceNode(table))
			children.push(datasourceNode(table))
		}
		if (table.codebook?.fields?.length) {
			children.push(codebookNode(table))
		}
		if (table.workflow?.length) {
			children.push(workflowNode(table))
		}

		result.push(bundleNode(table, children))
	})
	return result
}

function resourceNode(table: TableBundle): ResourceTreeData {
	const pathItems = (table.datatable?.path as string).split('/')
	const title =
		pathItems[pathItems.length - 1] ??
		`${table.name}.${table.datatable?.format}`
	return {
		href: `/resource/${table.name}/${title}`,
		title,
		icon: 'Database',
	}
}

function datasourceNode(table: TableBundle): ResourceTreeData {
	return {
		href: `/resource/${table.name}/datatable.json`,
		title: 'datatable.json',
		icon: 'PageData',
	}
}

function workflowNode(table: TableBundle): ResourceTreeData {
	return {
		href: `/resource/${table.name}/workflow.json`,
		icon: 'SetAction',
		title: 'workflow.json',
	}
}

function codebookNode(table: TableBundle): ResourceTreeData {
	return {
		href: `/resource/${table.name}/codebook.json`,
		icon: 'FormLibraryMirrored',
		title: 'codebook.json',
	}
}

function bundleNode(
	table: TableBundle,
	children: ResourceTreeData[],
): ResourceTreeData {
	return {
		href: `/resource/${table.name}`,
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
