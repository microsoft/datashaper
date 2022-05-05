/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FileCollection } from '@data-wrangling-components/utilities'
import type { Step, GraphManager } from '@data-wrangling-components/core'
import { createGraphManager } from '@data-wrangling-components/core'
import type { TableContainer } from '@essex/arquero'
import { useModalState } from '@data-wrangling-components/react-hooks'
import isArray from 'lodash-es/isArray.js'
import { useCallback, useEffect, useMemo, useState } from 'react'

export function useGraphManager(inputs: TableContainer[]): GraphManager {
	const manager = useMemo(() => createGraphManager(), [])
	useEffect(
		function injectInputTables() {
			inputs.forEach(i => manager.addInput(i))
		},
		[inputs],
	)
	return manager
}

export function useDeleteConfirm(onDelete?: (args: any) => void): {
	toggleDeleteModalOpen: () => void
	onConfirmDelete: () => void
	onDeleteClicked: (args: any) => void
	isDeleteModalOpen: boolean
} {
	const { isOpen, show, hide, toggle } = useModalState(undefined, undefined)
	const [deleteArg, setDeleteArg] = useState<any>()

	const onDeleteClicked = useCallback(
		(args: any) => {
			setDeleteArg(args)
			show()
		},
		[show, setDeleteArg],
	)

	const onConfirmDelete = useCallback(() => {
		onDelete?.(deleteArg)
		hide()
	}, [hide, deleteArg, onDelete])

	return {
		isDeleteModalOpen: isOpen,
		toggleDeleteModalOpen: toggle,
		onConfirmDelete,
		onDeleteClicked,
	}
}

//TODO: separate column and table functions into a new hooks file
//OR move this functionality to the pipeline?
export function useCreateTableName(
	store?: GraphManager,
): (name: string) => string {
	const verifyTableName = useCallback(
		(name: string): boolean => {
			return store ? store.outputs.includes(name) : false
		},
		[store],
	)

	return useCallback(
		(name: string): string => {
			const originalName = name.replace(/( \(\d+\))/, '')
			let derivedName = originalName
			let count = 1

			while (verifyTableName(derivedName)) {
				derivedName = `${originalName} (${count})`
				count++
			}
			return derivedName
		},
		[verifyTableName],
	)
}

export function useFormattedColumnArg(): (
	stepArgs: unknown,
	newName?: string,
) => object {
	return useCallback((stepArgs: unknown, newName = 'New column') => {
		const args = stepArgs as Record<string, unknown>
		Object.keys(args).forEach(x => {
			if (x === 'to' && !isArray(args[x])) args[x] = newName
		})
		return args
	}, [])
}

export function useFormattedColumnArgWithCount(): (
	step: Step,
	columnNames: string[],
) => object {
	const createColumnName = useCreateColumnName()

	return useCallback(
		(step: Step, columnNames) => {
			let args = step.args as Record<string, unknown>
			Object.keys(args).forEach(x => {
				if (x === 'to' && !isArray(args[x])) {
					const newColumnName = createColumnName(args[x] as string, columnNames)
					args = { ...args, [x]: newColumnName }
				}
			})
			return args
		},
		[createColumnName],
	)
}

function useCreateColumnName(): (
	name: string,
	columnNames: string[],
) => string {
	const verifyColumnName = useCallback(
		(name: string, columnNames: string[]): boolean => {
			return columnNames.includes(name)
		},
		[],
	)

	return useCallback(
		(name: string, columnNames: string[]) => {
			const originalName = name.replace(/( \(\d+\))/, '')
			let derivedName = originalName

			let count = 1
			while (verifyColumnName(derivedName, columnNames)) {
				derivedName = `${originalName} (${count})`
				count++
			}
			return derivedName
		},
		[verifyColumnName],
	)
}

export function useHandleOnUploadClick(
	acceptedFileTypes: string[],
	handleCollection?: (fileCollection: FileCollection) => void,
): () => void {
	return useCallback(() => {
		let input: HTMLInputElement | null = document.createElement('input')
		input.type = 'file'
		input.multiple = true
		input.accept = acceptedFileTypes.toString()
		input.onchange = async (e: any) => {
			if (e?.target?.files?.length) {
				const { files } = e.target
				const fileCollection = new FileCollection()
				try {
					for (const file of files) {
						await fileCollection.add(file)
					}
					handleCollection?.(fileCollection)
				} catch (e) {
					console.error(e)
				}
			}
		}
		input.click()
		input = null
	}, [acceptedFileTypes, handleCollection])
}
