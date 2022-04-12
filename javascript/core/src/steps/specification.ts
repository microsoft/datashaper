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

export interface InputNodeBinding {
	node: string
	output?: string
}
export type InputBinding = string | InputNodeBinding
export type BasicInput = string | { source: InputBinding }
export interface DualInput {
	source: InputBinding
	other: InputBinding
}
export type VariadicInput =
	| string
	| { source: InputBinding; others?: InputBinding[] }

export interface StepCommon {
	/**
	 * A unique identifier for this step
	 */
	id?: string

	/**
	 * helpful for documentation in JSON specs
	 */
	description?: string

	/**
	 * The bound inputs
	 * Key = Input Socket Name
	 * Value = Socket Binding to other node
	 */
	// input?: StepInputs

	/**
	 * The observed outputs to record.
	 * Key = output socket name
	 * Value = store table name
	 */
	output?: string | Record<string, string>
}

export type StepSpecification = StepCommon &
	(
		| { verb: Verb.Aggregate; args?: AggregateArgs; input: BasicInput }
		| { verb: Verb.Bin; args?: BinArgs; input: BasicInput }
		| { verb: Verb.Binarize; args?: BinarizeArgs; input: BasicInput }
		| { verb: Verb.Boolean; args?: BooleanArgs; input: BasicInput }
		| { verb: Verb.Concat; input: VariadicInput }
		| { verb: Verb.Convert; args?: ConvertArgs; input: BasicInput }
		| { verb: Verb.Dedupe; args?: DedupeArgs; input: BasicInput }
		| { verb: Verb.Difference; input: VariadicInput }
		| { verb: Verb.Derive; args?: DeriveArgs; input: BasicInput }
		| { verb: Verb.Erase; args?: EraseArgs; input: BasicInput }
		| { verb: Verb.Fetch; args?: FetchArgs; input: BasicInput }
		| { verb: Verb.Fill; args?: FillArgs; input: BasicInput }
		| { verb: Verb.Filter; args?: FilterArgs; input: BasicInput }
		| { verb: Verb.Fold; args?: FoldArgs; input: BasicInput }
		| { verb: Verb.Groupby; args?: GroupbyArgs; input: BasicInput }
		| { verb: Verb.Impute; args?: ImputeArgs; input: BasicInput }
		| { verb: Verb.Intersect; input: VariadicInput }
		| { verb: Verb.Join; args?: JoinArgs; input: DualInput }
		| { verb: Verb.Lookup; args?: LookupArgs; input: DualInput }
		| { verb: Verb.Merge; args?: MergeArgs; input: BasicInput }
		| { verb: Verb.OneHot; args?: OneHotArgs; input: BasicInput }
		| { verb: Verb.Orderby; args?: OrderbyArgs; input: BasicInput }
		| { verb: Verb.Pivot; args?: PivotArgs; input: BasicInput }
		| { verb: Verb.Recode; args?: RecodeArgs; input: BasicInput }
		| { verb: Verb.Rename; args?: RenameArgs; input: BasicInput }
		| { verb: Verb.Rollup; args?: RollupArgs; input: BasicInput }
		| { verb: Verb.Sample; args?: SampleArgs; input: BasicInput }
		| { verb: Verb.Select; args?: SelectArgs; input: BasicInput }
		| { verb: Verb.Spread; args?: SpreadArgs; input: BasicInput }
		| { verb: Verb.Unfold; args?: UnfoldArgs; input: BasicInput }
		| { verb: Verb.Union; input: VariadicInput }
		| { verb: Verb.Unorder; input: BasicInput }
		| { verb: Verb.Ungroup; input: BasicInput }
		| { verb: Verb.Unroll; args?: UnrollArgs; input: BasicInput }
		| { verb: Verb.Window; args?: WindowArgs; input: BasicInput }
	)

export interface Step<T extends object = any> {
	/**
	 * A unique identifier for this step
	 */
	id: string

	/**
	 * The verb being executed
	 */
	verb: Verb

	/**
	 * The verb arguments
	 */
	args: T

	/**
	 * The bound inputs
	 * Key = Input Socket Name
	 * Value = Socket Binding to other node
	 */
	input: {
		others?: InputBinding[]
	} & Record<string, InputNodeBinding>

	/**
	 * The observed outputs to record.
	 * Key = output socket name
	 * Value = store table name
	 */
	output: Record<string, string>
}

export interface Specification {
	name?: string
	description?: string
	steps?: StepSpecification[]
}
