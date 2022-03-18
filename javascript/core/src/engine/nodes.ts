/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Maybe} from '@data-wrangling-components/dataflow-graph';
import { NodeImpl } from '@data-wrangling-components/dataflow-graph'

import type { TableContainer } from '../types.js'

export enum StepNodeInput {
	Source = 'source',
}

export abstract class StepNode<Args> extends NodeImpl<
	Maybe<TableContainer>,
	Args
> {
	constructor() {
		super([StepNodeInput.Source])
	}
	protected doRecalculate(): void {
		const source = this.inputValue(StepNodeInput.Source)
		if (source != null) {
			this.emit(this.compute(source))
		} else {
			this.emit(undefined)
		}
	}

	protected abstract compute(source: TableContainer): Maybe<TableContainer>
}
