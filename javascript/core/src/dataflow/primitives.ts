/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export type Maybe<T> = T | undefined

export function handleMaybeAsync<T>(
	value: T | Promise<T>,
	handler: (value: T) => void,
): Promise<void> | void {
	if ((value as any).then) {
		return (value as Promise<T>).then(v => handler(v))
	} else {
		handler(value as T)
	}
}
