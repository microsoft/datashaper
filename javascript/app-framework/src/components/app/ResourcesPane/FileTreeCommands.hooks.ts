/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { type BaseFile, createBaseFile } from '@datashaper/utilities'
import type { ICommandBarItemProps, IContextualMenuItem } from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import { useCallback, useMemo } from 'react'

import { useDataPackage } from '../../../hooks/useDataPackage.js'
import { usePersistenceService } from '../../../hooks/usePersistenceService.js'
import { useTableBundles } from '../../../hooks/useTableBundles.js'
import type { ProfilePlugin } from '../../../types.js'
import {
	createCommandBar,
	openMenuItems,
	saveMenuItems,
} from './FileTreeCommands.utils.js'
import { TABLE_TYPES, ZIP_TYPES } from './ResourcesPane.constants.js'
import type { FileDefinition } from './ResourcesPane.types.js'

export function useFileManagementCommands(
	examples: FileDefinition[],
	expanded: boolean,
	onOpenFileRequested: (acceptedFiles: string[]) => Promise<BaseFile>,
	setFile: (file: BaseFile) => void,
	plugins: Map<string, ProfilePlugin>,
): {
	commands: ICommandBarItemProps[]
	onOpenCommands: IContextualMenuItem[]
	onSaveCommands: IContextualMenuItem[]
	newCommands: IContextualMenuItem[]
} {
	const tables = useTableBundles()
	const hasDataPackages = tables.length > 0
	const uploadZip = useUploadZip()
	const onClickDownloadZip = useDownloadZip()
	const dataPackage = useDataPackage()

	const onClickUploadTable = useCallback(
		() =>
			void onOpenFileRequested(TABLE_TYPES)
				.then(setFile)
				.catch(err => console.error('error loading table file', err)),
		[setFile, onOpenFileRequested],
	)

	const onClickUploadZip = useCallback(
		() =>
			void onOpenFileRequested(ZIP_TYPES)
				.then(file => uploadZip(file))
				.catch(err => console.error('error loading project file', err)),
		[uploadZip, onOpenFileRequested],
	)

	const onClickExample = useCallback(
		(ex: FileDefinition) => {
			void fetch(ex.url)
				.then(res => res.blob())
				.then(data => {
					const files = new Map<string, Blob>()
					files.set('datapackage.json', data)
					return dataPackage.load(files)
				})
				.catch(err => console.error('error loading example file', err))
		},
		[dataPackage],
	)

	const newCommands = useMemo<IContextualMenuItem[]>(() => {
		const result: IContextualMenuItem[] = []
		for (const plugin of plugins.values()) {
			console.log('P', plugin)
			if (plugin.isTopLevel && plugin.createResource) {
				result.push({
					key: plugin.profile,
					text: `New ${plugin.title}`,
					onClick: () => {
						const resource = plugin.createResource?.()
						resource.name = dataPackage.suggestResourceName(resource.name)
						dataPackage.addResource(resource)
					},
				})
			}
		}
		return result
	}, [dataPackage, plugins])

	const openCommands = useMemo(() => {
		return openMenuItems(
			examples,
			onClickExample,
			onClickUploadTable,
			onClickUploadZip,
		)
	}, [examples, onClickExample, onClickUploadTable, onClickUploadZip])

	const saveCommands = useMemo(
		() => saveMenuItems(onClickDownloadZip),
		[onClickDownloadZip],
	)

	const theme = useTheme()
	const commands = useMemo<ICommandBarItemProps[]>(
		() =>
			createCommandBar(
				expanded,
				hasDataPackages,
				newCommands,
				openCommands,
				saveCommands,
				theme,
			),
		[theme, hasDataPackages, expanded, openCommands, saveCommands, newCommands],
	)

	return {
		commands,
		newCommands,
		onOpenCommands: openCommands,
		onSaveCommands: saveCommands,
	}
}

function useUploadZip(): (file: BaseFile) => void {
	const persistence = usePersistenceService()
	return useCallback(
		(file: BaseFile) =>
			void persistence
				.load(file)
				.catch(err => console.error('error loading project', err)),
		[persistence],
	)
}

function useDownloadZip(): () => void {
	const persistence = usePersistenceService()
	return useCallback(
		() =>
			void persistence
				.save()
				.catch(err => console.error('error loading project', err)),
		[persistence],
	)
}

export function useOnOpenFileRequested(): (
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
