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
	 * This is a container resource for collecting raw files, workflows, and codebooks into a full table.
	 * At minimum it should usually contain one `sources` entry that points to a DataFile.
	 * As schemas or pipelines are built, those resources can be added to the sources entry.
	 */
	| 'data-bundle'
	/**
	 * This is the profile name for a Dataset
	 */
	| 'dataset'
	/**
	 * This is the profile name for a Workflow.
	 */
	| 'workflow'
	/**
	 * Any other custom profile string can be specified by applications.
	 */
	| string
