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
import type { AppProfile } from '../../../types.js'
import { CommandBarSection } from '../../../types.js'
import { TABLE_TYPES, ZIP_TYPES } from './ResourcesPane.constants.js'
import { icons } from './ResourcesPane.styles.js'
import type { FileDefinition } from './ResourcesPane.types.js'
import { useLoadDataPackage } from '../../../hooks/useLoadDataPackage.js'

/**
 * Gets the file-managament commandbar items
 *
 * @param examples - The provided examples
 * @param expanded - Whether the pane is expended
 * @param setFile - Set the imported file
 * @param profiles - The profile profiles
 * @returns A set of commands for the file management
 */
export function useFileManagementCommands(
	examples: FileDefinition[],
	setFile: (file: BaseFile) => void,
	profiles: Map<string, AppProfile>,
	narrow?: boolean,
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
	const newCommands = useNewMenuCommands(profiles)
	const saveCommands = useSaveMenuCommands(profiles)
	const openCommands = useOpenMenuItems(examples, profiles, setFile)
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
				text: narrow ? undefined : text,
				iconOnly: narrow,
				iconProps,
				buttonStyles,
				subMenuProps: { items },
				...extra,
			}
		},
		[buttonStyles, narrow],
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
 * @param profiles - The profile profiles
 * @returns
 */
function useNewMenuCommands(
	profiles: Map<string, AppProfile>,
): IContextualMenuItem[] {
	return useMemo<IContextualMenuItem[]>(
		() => getProfileCommands(CommandBarSection.New, profiles),
		[profiles],
	)
}

/**
 * Gets a list of menu items for the 'Save' Menu
 * @param profiles - The profile profiles
 * @returns
 */
function useSaveMenuCommands(
	profiles: Map<string, AppProfile>,
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
		result.push(...getProfileCommands(CommandBarSection.Save, profiles))
		return result
	}, [profiles, onClickDownloadZip])
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
 * @param profiles - The profile profiles
 * @returns
 */
function useOpenMenuItems(
	examples: FileDefinition[],
	profiles: Map<string, AppProfile>,
	setFile: (file: BaseFile) => void,
): IContextualMenuItem[] {
	const uploadZip = useUploadZip()
	const onOpenFileRequested = useOnOpenFileRequested()
	const loadDataPackage = useLoadDataPackage()

	const onClickExample = useCallback(
		(ex: FileDefinition) => void loadDataPackage(ex.url),
		[loadDataPackage],
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
			result.push(...getProfileCommands(CommandBarSection.Open, profiles))
		}
		return result
	}, [examples, profiles, onClickUploadTable, onClickUploadZip, onClickExample])
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
						for (const file of e.target.files as FileList) {
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

function getProfileCommands(
	section: CommandBarSection,
	profiles: Map<string, AppProfile>,
): IContextualMenuItem[] {
	const result: IContextualMenuItem[] = []
	for (const profile of profiles.values()) {
		const dynamicItems = profile.getCommandBarCommands?.(section)
		if (dynamicItems) {
			result.push(...dynamicItems)
		}
	}
	return result
}
