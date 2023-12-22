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
	| KnownProfile
	/**
	 * Any other custom profile string can be specified by applications.
	 */
	| string

export enum KnownProfile {
	DataPackage = 'datapackage',
	DataTable = 'datatable',
	Codebook = 'codebook',
	DataGraph = 'datagraph',
	Workflow = 'workflow',
	TableBundle = 'tablebundle',
}
