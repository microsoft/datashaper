/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export class FileWithPath extends File {
	constructor(blob: Blob, name: string, private _path: string) {
		super([blob], name)
	}

	get path(): string {
		return this._path
	}

	set path(path: string) {
		this._path = path
	}
}
