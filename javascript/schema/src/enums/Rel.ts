/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export type Rel =
	| KnownRel
	/**
	 * Any other custom Rel type can be specified by bundles
	 */
	| string

export enum KnownRel {
	Input = 'input',
	Codebook = 'codebook',
	Workflow = 'workflow',
}
