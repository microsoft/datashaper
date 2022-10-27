/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export enum ErrorCode {
	Required = 'required constraint',
	Unique = 'unique constraint',
	MinLength = 'min length constraint',
	MaxLength = 'max length constraint',
	Minimum = 'minimum length constraint',
	Maximum = 'maximum length constraint',
	Pattern = 'pattern constraint',
	Enum = 'enum constraint',
}
