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
	UnrollArgs,
	Verb,
	WindowArgs,
} from './verbs/index.js'

/**
 * The root data-wrangling specification. (Used for generating JSON Schema)
 */
export interface Specification {
	/**
	 * The name of the specification
	 */
	name?: string

	/**
	 * A user-friendly description of the specification
	 */
	description?: string

	/**
	 * If specified, the default input to use. This will specify the default input of the first step.
	 * If the first step already has a defined default input, this will throw.
	 */
	input?: string

	/**
	 * If specified, the default output to use. This is equivalent to defining the 'output' property
	 * of the last step in the steps array
	 */
	output?: string

	/**
	 * The workflow steps
	 */
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
		| ({ verb: Verb.Derive; args?: DeriveArgs } & BasicIO)
		| ({ verb: Verb.Difference } & VariadicIO)
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
		| ({ verb: Verb.Onehot; args?: OnehotArgs } & BasicIO)
		| ({ verb: Verb.Orderby; args?: OrderbyArgs } & BasicIO)
		| ({ verb: Verb.Pivot; args?: PivotArgs } & BasicIO)
		| ({ verb: Verb.Recode; args?: RecodeArgs } & BasicIO)
		| ({ verb: Verb.Rename; args?: RenameArgs } & BasicIO)
		| ({ verb: Verb.Rollup; args?: RollupArgs } & BasicIO)
		| ({ verb: Verb.Sample; args?: SampleArgs } & BasicIO)
		| ({ verb: Verb.Select; args?: SelectArgs } & BasicIO)
		| ({ verb: Verb.Spread; args?: SpreadArgs } & BasicIO)
		| ({ verb: Verb.Unfold; args?: UnfoldArgs } & BasicIO)
		| ({ verb: Verb.Ungroup } & BasicIO)
		| ({ verb: Verb.Union } & VariadicIO)
		| ({ verb: Verb.Unorder } & BasicIO)
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
 * Step input specifications. If this is a string, we'll bind to the default output
 * of the given node ID. If no node has that ID, we'll bind against the table-store's
 * named table given the string.
 *
 * If this is an input binding, it's an explicit binding to another step in the pipeline.
 */
export type InputSpecification = string | InputBinding

/**
 * An explicit step input binding
 */
export interface InputBinding {
	/**
	 * The id of the node to bind to
	 */
	node: string

	/**
	 * The named output of the node to bind with. If not defined, this will
	 * be the default output "target"
	 */
	output?: string
}

/**
 * Single-input, single-output step I/O
 */
export interface BasicIO {
	/**
	 * Standard step input; single source with default name "source".
	 *
	 * If undefined, the default output of the previous step will be used (if available).
	 * If no previous step is available, this will remain undefined
	 */
	input?: string | { source: InputSpecification }

	/**
	 * Standard step output; single output with default name "target"
	 */
	output?: string | { target: string }
}

/**
 * Dual-input, single-output step I/O
 */
export interface DualInputIO extends BasicIO {
	/**
	 * The inputs that must be bound; "source" & "other".
	 */
	input: {
		/**
		 * The primary input, which must be specified
		 */
		source: InputSpecification

		/**
		 * The secondary input, which must be specified
		 */
		other: InputSpecification
	}
}

/**
 * Multi-input, single output step I/O
 */
export interface VariadicIO extends BasicIO {
	/**
	 * The step inputs; a required "source" and optional, variadic "others". If this is a
	 * string, it is used to bind the primary input.
	 */
	input: {
		/**
		 * The primary input
		 */
		source: InputSpecification

		/**
		 * The variadic secondary inputs
		 */
		others?: InputSpecification[]
	}
}
