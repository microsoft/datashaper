/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export class LoadingOrchestrator {
	private _isLoading: boolean

	public constructor() {
		this._isLoading = false
	}

	public get isLoading(): boolean {
		return this._isLoading
	}

	start(): void {
		this._isLoading = true
	}

	stop(): void {
		this._isLoading = false
	}
}
