/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/**
 * Resources must have a profile, which is a key defining how it should be interpreted.
 * Profiles are essentially shorthand for a schema URL.
 * The core profiles for DataShaper are defined here, but any application can define one as a string.
 */
export type Profile =
	/**
	 * This is the profile name for a Codebook.
	 */
	| 'codebook'
	/**
	 * This is the profile name for a DataTable
	 */
	| 'datatable'
	/**
	 * This is the profile for a parent resource that links a table with child sources such as codebooks and workflows
	 */
	| 'databundle'
	/**
	 * This is the profile name for a Workflow.
	 */
	| 'workflow'
	/**
	 * Any other custom profile string can be specified by applications.
	 */
	| string
