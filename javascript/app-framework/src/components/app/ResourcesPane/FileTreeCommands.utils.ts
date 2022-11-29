/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	ICommandBarItemProps,
	IContextualMenuItem,
	ITheme,
} from '@fluentui/react'

import { icons } from './ResourcesPane.styles.js'
import type { FileDefinition } from './ResourcesPane.types.js'

export function newMenuItems(onNewTable: () => void) {
	return [
		{
			key: 'newTable',
			text: 'Table',
			iconProps: icons.table,
			onClick: onNewTable,
		},
	]
}

export function openMenuItems(
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

export function saveMenuItems(
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
	isSaveEnabled: boolean,
	_newProps: IContextualMenuItem[],
	openProps: IContextualMenuItem[],
	saveProps: IContextualMenuItem[],
	theme: ITheme,
): ICommandBarItemProps[] {
	return [
		// {
		// 	key: 'new',
		// 	text: expanded ? 'New' : '',
		// 	iconProps: icons.newFile,
		// 	subMenuProps: {
		// 		items: newProps,
		// 	},
		// 	buttonStyles: {
		// 		root: {
		// 			background: theme.palette.neutralLighter,
		// 		},
		// 	},
		// },
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
			disabled: !isSaveEnabled,
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
