/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	Pipeline,
	Step,
	TableStore,
} from '@data-wrangling-components/core'
import {
	createPipeline,
	createTableStore,
} from '@data-wrangling-components/core'
import { useBoolean } from '@fluentui/react-hooks'
import isArray from 'lodash-es/isArray.js'
import { useCallback, useMemo, useState } from 'react'

export function useStore(): TableStore {
	return useMemo(() => createTableStore(), [])
}

export function usePipeline(store: TableStore, steps?: Step[]): Pipeline {
	return useMemo(() => {
		const pipeline = createPipeline(store)
		if (steps) {
			pipeline.addAll(steps)
		}
		return pipeline
	}, [store, steps])
}

export function useDeleteConfirm(onDelete?: (args: any) => void): {
	toggleDeleteModalOpen: () => void
	onConfirmDelete: () => void
	onDeleteClicked: (args: any) => void
	isDeleteModalOpen: boolean
} {
	const [deleteArg, setDeleteArg] = useState<any>()
	const [isDeleteModalOpen, { toggle: toggleDeleteModalOpen }] =
		useBoolean(false)

	const onDeleteClicked = useCallback(
		(args: any) => {
			setDeleteArg(args)
			toggleDeleteModalOpen()
		},
		[toggleDeleteModalOpen, setDeleteArg],
	)

	const onConfirmDelete = useCallback(() => {
		onDelete?.(deleteArg)
		toggleDeleteModalOpen()
	}, [toggleDeleteModalOpen, deleteArg, onDelete])

	return {
		isDeleteModalOpen,
		onConfirmDelete,
		toggleDeleteModalOpen,
		onDeleteClicked,
	}
}

//TODO: separate column and table functions into a new hooks file
//OR move this functionality to the pipeline?
export function useCreateTableName(
	store?: TableStore,
): (name: string) => string {
	const verifyTableName = useCallback(
		(name: string): boolean => {
			return store ? store.list().includes(name) : false
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
