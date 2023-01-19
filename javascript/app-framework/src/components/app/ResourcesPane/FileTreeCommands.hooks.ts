/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { type BaseFile, createBaseFile } from '@datashaper/utilities'
import type {
	ICommandBarItemProps,
	IContextualMenuItem,
	IIconProps,
} from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import { useObservableState } from 'observable-hooks'
import { useCallback, useMemo } from 'react'

import { useDataPackage } from '../../../hooks/useDataPackage.js'
import { usePersistenceService } from '../../../hooks/usePersistenceService.js'
import type { ProfilePlugin } from '../../../types.js'
import { CommandBarSection } from '../../../types.js'
import { TABLE_TYPES, ZIP_TYPES } from './ResourcesPane.constants.js'
import { icons } from './ResourcesPane.styles.js'
import type { FileDefinition } from './ResourcesPane.types.js'

/**
 * Gets the file-managament commandbar items
 *
 * @param examples - The provided examples
 * @param expanded - Whether the pane is expended
 * @param setFile - Set the imported file
 * @param plugins - The profile plugins
 * @returns A set of commands for the file management
 */
export function useFileManagementCommands(
	examples: FileDefinition[],
	expanded: boolean,
	setFile: (file: BaseFile) => void,
	plugins: Map<string, ProfilePlugin>,
): {
	commands: ICommandBarItemProps[]
	openCommands: IContextualMenuItem[]
	saveCommands: IContextualMenuItem[]
	newCommands: IContextualMenuItem[]
} {
	const dataPackage = useDataPackage()
	const isDataPackageEmpty = useObservableState(
		dataPackage.isEmpty$,
		dataPackage.isEmpty,
	)
	const newCommands = useNewMenuCommands(plugins)
	const saveCommands = useSaveMenuCommands(plugins)
	const openCommands = useOpenMenuItems(examples, plugins, setFile)
	const theme = useTheme()
	const buttonStyles = useMemo(
		() => ({
			root: {
				background: theme.palette.neutralLighter,
			},
		}),
		[theme],
	)
	const createItem = useCallback(
		(
			text: string,
			iconProps: IIconProps,
			items: IContextualMenuItem[],
			extra: Partial<ICommandBarItemProps> = {},
		): ICommandBarItemProps => {
			return {
				key: text,
				text: expanded ? text : undefined,
				iconOnly: !expanded,
				iconProps,
				buttonStyles,
				subMenuProps: { items },
				...extra,
			}
		},
		[buttonStyles, expanded],
	)
	const commands = useMemo<ICommandBarItemProps[]>(
		() => [
			createItem('New', icons.newFile, newCommands),
			createItem('Open', icons.openFile, openCommands),
			createItem('Save', icons.save, saveCommands, {
				disabled: isDataPackageEmpty,
			}),
		],
		[createItem, newCommands, openCommands, saveCommands, isDataPackageEmpty],
	)

	return {
		commands,
		newCommands,
		openCommands,
		saveCommands,
	}
}

/**
 * Gets a list of menu items for the 'New' Menu
 * @param plugins - The profile plugins
 * @returns
 */
function useNewMenuCommands(
	plugins: Map<string, ProfilePlugin>,
): IContextualMenuItem[] {
	return useMemo<IContextualMenuItem[]>(
		() => getPluginCommands(CommandBarSection.New, plugins),
		[plugins],
	)
}

/**
 * Gets a list of menu items for the 'Save' Menu
 * @param plugins - The profile plugins
 * @returns
 */
function useSaveMenuCommands(
	plugins: Map<string, ProfilePlugin>,
): IContextualMenuItem[] {
	const onClickDownloadZip = useDownloadZip()
	return useMemo<IContextualMenuItem[]>(() => {
		const result: IContextualMenuItem[] = [
			{
				key: 'project',
				text: 'Project',
				iconProps: icons.project,
				onClick: onClickDownloadZip,
			},
		]
		result.push(...getPluginCommands(CommandBarSection.Save, plugins))
		return result
	}, [plugins, onClickDownloadZip])
}

function useDownloadZip(): () => void {
	const persistence = usePersistenceService()
	return useCallback(
		() =>
			void persistence
				.save()
				.catch((err) => console.error('error loading project', err)),
		[persistence],
	)
}

/**
 * Gets a list of menu items for the 'Open' Menu
 * @param plugins - The profile plugins
 * @returns
 */
function useOpenMenuItems(
	examples: FileDefinition[],
	plugins: Map<string, ProfilePlugin>,
	setFile: (file: BaseFile) => void,
): IContextualMenuItem[] {
	const dataPackage = useDataPackage()
	const uploadZip = useUploadZip()
	const onOpenFileRequested = useOnOpenFileRequested()

	const onClickExample = useCallback(
		(ex: FileDefinition) => {
			void fetch(ex.url)
				.then((res) => res.blob())
				.then((data) => {
					const files = new Map<string, Blob>()
					files.set('datapackage.json', data)
					return dataPackage.load(files)
				})
				.catch((err) => console.error('error loading example file', err))
		},
		[dataPackage],
	)

	const onClickUploadTable = useCallback(
		() =>
			void onOpenFileRequested(TABLE_TYPES)
				.then(setFile)
				.catch((err) => console.error('error loading table file', err)),
		[setFile, onOpenFileRequested],
	)

	const onClickUploadZip = useCallback(
		() =>
			void onOpenFileRequested(ZIP_TYPES)
				.then((file) => uploadZip(file))
				.catch((err) => console.error('error loading project file', err)),
		[uploadZip, onOpenFileRequested],
	)

	return useMemo<IContextualMenuItem[]>(() => {
		const result: IContextualMenuItem[] = [
			{
				key: 'csv',
				text: 'Data file',
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
					items: examples.map((example) => ({
						key: example.name,
						text: example.name,
						onClick: () => onClickExample(example),
					})),
				},
			})
			result.push(...getPluginCommands(CommandBarSection.Open, plugins))
		}
		return result
	}, [examples, plugins, onClickUploadTable, onClickUploadZip, onClickExample])
}

function useUploadZip(): (file: BaseFile) => void {
	const persistence = usePersistenceService()
	return useCallback(
		(file: BaseFile) =>
			void persistence
				.load(file)
				.catch((err) => console.error('error loading project', err)),
		[persistence],
	)
}

function useOnOpenFileRequested(): (
	acceptedFileTypes: string[],
) => Promise<BaseFile> {
	return useCallback((acceptedFileTypes: string[]) => {
		return new Promise<BaseFile>((resolve, reject) => {
			try {
				let input: HTMLInputElement | null = document.createElement('input')
				input.type = 'file'
				input.multiple = false
				input.accept = acceptedFileTypes.toString()
				// eslint-disable-next-line
				input.onchange = (e: any) => {
					// eslint-disable-next-line
					if (e?.target?.files?.length) {
						// eslint-disable-next-line
						for (let file of e.target.files as FileList) {
							try {
								const { name }: { name: string } = file
								const baseFile = createBaseFile(file, { name })
								//depending of the type // we don't have FileType yet
								resolve(baseFile)
							} catch (e) {
								console.error(e)
								reject(e)
							}
						}
					}
				}
				input.click()
				input = null
			} catch (e) {
				console.error(e)
				reject(e)
			}
		})
	}, [])
}

function getPluginCommands(
	section: CommandBarSection,
	plugins: Map<string, ProfilePlugin>,
): IContextualMenuItem[] {
	const result: IContextualMenuItem[] = []
	for (const plugin of plugins.values()) {
		const dynamicItems = plugin.getCommandBarCommands?.(section)
		if (dynamicItems) {
			result.push(...dynamicItems)
		}
	}
	return result
}
