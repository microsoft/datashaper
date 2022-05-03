/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, GraphManager } from '@data-wrangling-components/core'
import { createGraphManager } from '@data-wrangling-components/core'
import { useBoolean } from '@fluentui/react-hooks'
import isArray from 'lodash-es/isArray.js'
import { useCallback, useEffect, useMemo, useState } from 'react'

export function useGraphManager(): GraphManager {
	// TODO: inject known tables
	return useMemo(() => createGraphManager(), [])
}

export function usePipeline(store: GraphManager, steps?: Step[]): void {
	/* eslint-disable react-hooks/exhaustive-deps */
	return useEffect(() => {
		if (steps) {
			steps.forEach(s => store.addStep(s))
		}
	}, [
		store,
		// do not re-fire this memo when the steps change; this will redrive the pipeline
		// on every step update
		// steps,
	])
	/* eslint-enable react-hooks/exhaustive-deps */
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
