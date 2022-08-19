/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Workflow } from '../engine/Workflow.js'

/**
 * Suggests a new column name given the list passed. If the name is
 * used, this will append numbers to the end.
 * e.g. "column" may result in "column 1" or "column 2" if there are
 * collisions
 *
 * @param name - the proposed name
 * @param columnNames - the existing columnNames for the target table
 */
export function nextColumnName(name: string, columnNames: string[]): string {
	const originalName = name.replace(/( \(\d+\))/, '')
	let derivedName = originalName

	let count = 1
	while (columnNames?.includes(name)) {
		derivedName = `${originalName} (${count})`
		count++
	}
	return derivedName
}

/**
 * Suggests a new table name given the root. If the root is
 * used, this will append numbers to the end.
 * e.g. "join" may result in "join 1" or "join 2" if there are
 * collisions
 *
 * @param name - the proposed name
 */
export function nextOutputName(name: string, workflow: Workflow): string {
	const originalName = name.replace(/( \(\d+\))/, '')
	let derivedName = originalName
	let count = 1

	while (workflow.hasOutputName(derivedName)) {
		derivedName = `${originalName} (${count})`
		count++
	}
	return derivedName
}

/**
 * Suggests a new table node given the root. If the root is
 * used, this will append numbers to the end.
 * e.g. "join" may result in "join 1" or "join 2" if there are
 * collisions
 *
 * @param name - the proposed node name
 */
export function nextOutputNode(name: string, workflow: Workflow): string {
	const originalName = name.replace(/( \(\d+\))/, '')
	let derivedName = originalName
	let count = 1

	while (workflow.hasOutput(derivedName)) {
		derivedName = `${originalName} (${count})`
		count++
	}
	return derivedName
}
