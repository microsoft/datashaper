/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	BasicInput,
	DualInput,
	UnknownInput,
	VariadicInput,
} from './bindings.js'
import type {
	AggregateArgs,
	BinArgs,
	BinarizeArgs,
	BooleanArgs,
	ConvertArgs,
	CopyArgs,
	DedupeArgs,
	DeriveArgs,
	DropArgs,
	EncodeDecodeArgs,
	EraseArgs,
	FillArgs,
	FilterArgs,
	FoldArgs,
	GroupbyArgs,
	ImputeArgs,
	JoinArgs,
	LookupArgs,
	MergeArgs,
	OnehotArgs,
	OrderbyArgs,
	PivotArgs,
	RecodeArgs,
	RenameArgs,
	RollupArgs,
	SampleArgs,
	SelectArgs,
	SpreadArgs,
	UnfoldArgs,
	UnhotArgs,
	UnrollArgs,
	Verb,
	WindowArgs,
} from './verbs.js'

/**
 * Common step properties
 */
export interface StepJsonCommon {
	/**
	 * A unique identifier for this step
	 */
	id?: string
}

/**
 * Specification for step items
 */
export type Step = StepJsonCommon &
	(
		| ({ verb: Verb.Aggregate; args?: AggregateArgs } & BasicInput)
		| ({ verb: Verb.Bin; args?: BinArgs } & BasicInput)
		| ({ verb: Verb.Binarize; args?: BinarizeArgs } & BasicInput)
		| ({ verb: Verb.Boolean; args?: BooleanArgs } & BasicInput)
		| ({ verb: Verb.Concat } & VariadicInput)
		| ({ verb: Verb.Convert; args?: ConvertArgs } & BasicInput)
		| ({ verb: Verb.Copy; args?: CopyArgs } & BasicInput)
		| ({ verb: Verb.Dedupe; args?: DedupeArgs } & BasicInput)
		| ({ verb: Verb.Derive; args?: DeriveArgs } & BasicInput)
		| ({ verb: Verb.Difference } & VariadicInput)
		| ({ verb: Verb.Decode; args?: EncodeDecodeArgs } & BasicInput)
		| ({ verb: Verb.Drop; args?: DropArgs } & BasicInput)
		| ({ verb: Verb.Encode; args?: EncodeDecodeArgs } & BasicInput)
		| ({ verb: Verb.Erase; args?: EraseArgs } & BasicInput)
		| ({ verb: Verb.Fill; args?: FillArgs } & BasicInput)
		| ({ verb: Verb.Filter; args?: FilterArgs } & BasicInput)
		| ({ verb: Verb.Fold; args?: FoldArgs } & BasicInput)
		| ({ verb: Verb.Groupby; args?: GroupbyArgs } & BasicInput)
		| ({ verb: Verb.Impute; args?: ImputeArgs } & BasicInput)
		| ({ verb: Verb.Intersect } & VariadicInput)
		| ({ verb: Verb.Join; args?: JoinArgs } & DualInput)
		| ({ verb: Verb.Lookup; args?: LookupArgs } & DualInput)
		| ({ verb: Verb.Merge; args?: MergeArgs } & BasicInput)
		| ({ verb: Verb.Onehot; args?: OnehotArgs } & BasicInput)
		| ({ verb: Verb.Orderby; args?: OrderbyArgs } & BasicInput)
		| ({ verb: Verb.Pivot; args?: PivotArgs } & BasicInput)
		| ({ verb: Verb.Recode; args?: RecodeArgs } & BasicInput)
		| ({ verb: Verb.Rename; args?: RenameArgs } & BasicInput)
		| ({ verb: Verb.Rollup; args?: RollupArgs } & BasicInput)
		| ({ verb: Verb.Sample; args?: SampleArgs } & BasicInput)
		| ({ verb: Verb.Select; args?: SelectArgs } & BasicInput)
		| ({ verb: Verb.Spread; args?: SpreadArgs } & BasicInput)
		| ({ verb: Verb.Unfold; args?: UnfoldArgs } & BasicInput)
		| ({ verb: Verb.Ungroup } & BasicInput)
		| ({ verb: Verb.Unhot; args?: UnhotArgs } & BasicInput)
		| ({ verb: Verb.Union } & VariadicInput)
		| ({ verb: Verb.Unorder } & BasicInput)
		| ({ verb: Verb.Unroll; args?: UnrollArgs } & BasicInput)
		| ({ verb: Verb.Window; args?: WindowArgs } & BasicInput)

		/**
		 * Custom step - we may not know the verb, args, or binding pattern
		 */
		| ({ verb: string; args?: unknown } & UnknownInput)
	)
