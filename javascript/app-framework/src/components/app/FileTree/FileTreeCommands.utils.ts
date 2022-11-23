/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	ICommandBarItemProps,
	IContextualMenuItem,
	ITheme,
} from '@fluentui/react'

import { icons } from './FileTree.styles.js'
import type { FileDefinition } from './FileTree.types.js'

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
