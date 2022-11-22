/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Blob from 'cross-blob'
export const write = (asset: { toSchema: () => any }, extra: any = {}): Blob =>
	toBlob({ ...asset.toSchema(), ...extra })
export const toStr = (obj: unknown): string => JSON.stringify(obj, null, 2)
export const toBlob = (obj: unknown): Blob => new Blob([toStr(obj)])
