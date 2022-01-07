/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export enum FileType {
	csv = 'csv',
	tsv = 'tsv',
	txt = 'txt',
	json = 'json',
	zip = 'zip',
	arrow = 'arrow',
	table = 'table',
}

export enum FileMimeType {
	csv = 'text/csv',
	tsv = 'text/tab-separated-values',
	txt = 'text/plain',
	json = 'application/json',
	zip = 'application/x-zip-compressed',
	arrow = 'application/x-arrow',
	excel = 'application/vnd.ms-excel',
	folder = '',
	'text/csv' = '.csv',
	'text/tab-separated-values' = '.tsv',
	'text/plain' = '.txt',
	'application/json' = '.json',
	'application/x-zip-compressed' = '.zip',
	'application/x-arrow' = '.arrow',
	'application/vnd.ms-excel' = '.xlsx',
}
