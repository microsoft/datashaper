/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Verb } from '@datashaper/schema'

const defaultIcon = 'LightningBolt'
const VerbIcon: Partial<Record<Verb, string>> = {
	[Verb.Bin]: 'ReportDocument',
	[Verb.Binarize]: 'SplitObject',
	[Verb.Filter]: 'Filter',
	[Verb.Aggregate]: 'Merge',
	[Verb.Join]: 'BranchMerge',
	[Verb.Lookup]: 'BranchPullRequest',
}

export function getVerbIcon(verb: Verb): string {
	return VerbIcon[verb] ?? defaultIcon
}
