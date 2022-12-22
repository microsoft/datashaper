/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * A rel is a string that describes the relationship between a resource and its child.
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
