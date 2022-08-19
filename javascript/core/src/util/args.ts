/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export function argsHasOutputColumn(args: unknown): boolean {
	return args['to'] && typeof args['to'] === 'string'
}
