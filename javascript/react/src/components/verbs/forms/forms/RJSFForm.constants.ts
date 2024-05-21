/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export const UI_SCHEMA_DEFAULTS = {
	'ui:submitButtonOptions': {
		norender: true,
	},
}

// some of our ux is intentionally managed by HOCs
// this should eventually change, but for now we can exclude those properties to maintain compatibility with hand-built forms
// TODO: "dataType" is on the InputColumnArgs, but should only be on Recode
export const EXCLUDE_PROPERTIES = new Set(['column', 'columns', 'to', 'dataType'])
export const FIXED_LABELS: Record<string, string> = {
	preserveSource: 'Keep source columns',
	printRange: 'Print range as output'
}

// establish a few friendly titles for our enums
// our TS types are written such that the names are friendly, but the keys map to arquero ops.
// the TS values are not output to JSONSchema however.
export const FIXED_ENUM_TITLES: Record<string, string> = {
	array_agg: 'Create array',
	array_agg_distinct: 'Create array distinct',
	distinct: 'Count distinct',
	stdev: 'Standard deviation',
	stdevp: 'Standard deviation population',
}


// TODO: this would be MUCH better if bound to the InputColumn type on the schema,
// but that is not preserved when generating off of ts.
// we have a conflict with the Fold "value" column and others such as Fill which have an actual "value" _value_
export const COLUMN_ARGS = ['column', 'columns', 'groupby', 'column1', 'column2']
