/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	AggregateArgs,
	BinArgs,
	BinarizeArgs,
	BooleanArgs,
	ConvertArgs,
	DedupeArgs,
	DeriveArgs,
	EraseArgs,
	FetchArgs,
	FillArgs,
	FilterArgs,
	FoldArgs,
	GroupbyArgs,
	ImputeArgs,
	JoinArgs,
	LookupArgs,
	MergeArgs,
	OneHotArgs,
	OrderbyArgs,
	PivotArgs,
	RecodeArgs,
	RenameArgs,
	RollupArgs,
	SampleArgs,
	SelectArgs,
	SpreadArgs,
	UnfoldArgs,
	UnrollArgs,
	WindowArgs,
} from '../verbs/index.js'
import type { Verb } from '../verbs/index.js'

/**
 * The root type used for JSON schema specification
 */
export interface Specification {
	name?: string
	description?: string
	steps?: StepSpecification[]
}

/**
 * Specification for step items
 */
export type StepSpecification = StepCommon &
	(
		| ({ verb: Verb.Aggregate; args?: AggregateArgs } & BasicIO)
		| ({ verb: Verb.Bin; args?: BinArgs } & BasicIO)
		| ({ verb: Verb.Binarize; args?: BinarizeArgs } & BasicIO)
		| ({ verb: Verb.Boolean; args?: BooleanArgs } & BasicIO)
		| ({ verb: Verb.Concat } & VariadicIO)
		| ({ verb: Verb.Convert; args?: ConvertArgs } & BasicIO)
		| ({ verb: Verb.Dedupe; args?: DedupeArgs } & BasicIO)
		| ({ verb: Verb.Difference } & VariadicIO)
		| ({ verb: Verb.Derive; args?: DeriveArgs } & BasicIO)
		| ({ verb: Verb.Erase; args?: EraseArgs } & BasicIO)
		| ({ verb: Verb.Fetch; args?: FetchArgs } & BasicIO)
		| ({ verb: Verb.Fill; args?: FillArgs } & BasicIO)
		| ({ verb: Verb.Filter; args?: FilterArgs } & BasicIO)
		| ({ verb: Verb.Fold; args?: FoldArgs } & BasicIO)
		| ({ verb: Verb.Groupby; args?: GroupbyArgs } & BasicIO)
		| ({ verb: Verb.Impute; args?: ImputeArgs } & BasicIO)
		| ({ verb: Verb.Intersect } & VariadicIO)
		| ({ verb: Verb.Join; args?: JoinArgs } & DualInputIO)
		| ({ verb: Verb.Lookup; args?: LookupArgs } & DualInputIO)
		| ({ verb: Verb.Merge; args?: MergeArgs } & BasicIO)
		| ({ verb: Verb.OneHot; args?: OneHotArgs } & BasicIO)
		| ({ verb: Verb.Orderby; args?: OrderbyArgs } & BasicIO)
		| ({ verb: Verb.Pivot; args?: PivotArgs } & BasicIO)
		| ({ verb: Verb.Recode; args?: RecodeArgs } & BasicIO)
		| ({ verb: Verb.Rename; args?: RenameArgs } & BasicIO)
		| ({ verb: Verb.Rollup; args?: RollupArgs } & BasicIO)
		| ({ verb: Verb.Sample; args?: SampleArgs } & BasicIO)
		| ({ verb: Verb.Select; args?: SelectArgs } & BasicIO)
		| ({ verb: Verb.Spread; args?: SpreadArgs } & BasicIO)
		| ({ verb: Verb.Unfold; args?: UnfoldArgs } & BasicIO)
		| ({ verb: Verb.Union } & VariadicIO)
		| { verb: Verb.Unorder; input: BasicInput; output: BasicOutput }
		| { verb: Verb.Ungroup; input: BasicInput; output: BasicOutput }
		| ({ verb: Verb.Unroll; args?: UnrollArgs } & BasicIO)
		| ({ verb: Verb.Window; args?: WindowArgs } & BasicIO)
	)

/**
 * Common step properties
 */
export interface StepCommon {
	/**
	 * A unique identifier for this step
	 */
	id?: string

	/**
	 * helpful for documentation in JSON specs
	 */
	description?: string
}

/**
 * Node Input Binding
 */
export type InputBinding = string | InputNodeBinding
export type InputNodeBinding = { node: string; output?: string }

/**
 * Standard I/O Patterns
 */
export type BasicInput = string | { source: InputBinding }
export type BasicOutput = string | { target: string }
export type BasicIO = { input: BasicInput; output: BasicOutput }

export type DualInput = { source: InputBinding; other: InputBinding }
export type DualInputIO = { input: DualInput; output: BasicOutput }

export type VariadicInput =
	| string
	| { source: InputBinding; others?: InputBinding[] }
export type VariadicIO = { input: VariadicInput; output: BasicOutput }
