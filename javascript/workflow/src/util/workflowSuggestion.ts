/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

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
	while (columnNames?.includes(derivedName)) {
		derivedName = `${originalName} (${count})`
		count++
	}
	return derivedName
}
