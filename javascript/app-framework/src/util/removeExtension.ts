/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function removeExtension(fileName: string): string {
	const props = fileName.split('.')
	return props.shift() ?? fileName
}
