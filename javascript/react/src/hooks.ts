/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GraphManager } from '@data-wrangling-components/core'
import { createGraphManager } from '@data-wrangling-components/core'
import type { TableContainer } from '@essex/arquero'
import isArray from 'lodash-es/isArray.js'
import { useCallback, useEffect, useMemo } from 'react'

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

/**
 * Returns a hook to generate a new table name based on the given input e.g.
 * "join" could result in "join 1" or "join 2" depending on how many collisions
 *  occur.
 * @param graph - the graph manager
 * @returns a safe output name to use
 */
export function useCreateTableName(
	graph: GraphManager,
): (name: string) => string {
	return useCallback(
		(name: string): string => graph.suggestOutputName(name),
		[graph],
	)
}

export function useFormattedColumnArg(): (
	stepArgs: unknown,
	newName?: string,
) => object {
	return useCallback((stepArgs: unknown, newName = 'New column') => {
		const args = stepArgs as Record<string, unknown>
		Object.keys(args).forEach(key => {
			if (key === 'to' && !isArray(args[key])) {
				args[key] = newName
			}
		})
		return args
	}, [])
}
