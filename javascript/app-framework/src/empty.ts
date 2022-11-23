/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export const EMPTY_ARRAY = Object.freeze([]) as any as any[]
export const EMPTY_OBJECT = Object.freeze({}) as any as any

/**
 * A utility function to cast the default empty array into the correct type;
 * @returns an empty array
 */
export function emptyArray<T>(): T[] {
	return EMPTY_ARRAY as T[]
}

/**
 * A utility function to cast the default empty object to the correct type
 * @returns an empty object
 */
export function emptyObject<T>(): NonNullable<T> {
	return EMPTY_OBJECT as NonNullable<T>
}
