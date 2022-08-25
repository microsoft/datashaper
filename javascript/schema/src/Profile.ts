/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export type Profile =
	/**
	 * This is a container resource for collecting raw files, workflows, and codebooks into a full table.
	 * At minimum it should usually contain one `sources` entry that points to a DataFile.
	 * As schemas or pipelines are built, those resources can be added to the sources entry.
	 */
	| 'data-bundle'
	/**
	 * This is the profile name for a Workflow.
	 */
	| 'workflow'
	| string
