/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Observed } from '@datashaper/workflow'
import { useEffect, useState } from 'react'

/**
 * Convenient wrapper to get properties off of Observables that aren't fully observable,
 * using onChange to update an intermediate value.
 */
export function useUnobservedProperty<O extends Observed, P>(
	observable: O,
	property: string,
): P {
	const [prop, setProp] = useState<P>(observable[property as keyof O] as P)
	useEffect(
		() =>
			observable.onChange(() => setProp(observable[property as keyof O] as P)),
		[observable, property, setProp],
	)
	return prop
}
