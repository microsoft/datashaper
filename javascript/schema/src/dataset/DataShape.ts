/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataNature, DataOrientation } from '../data.js'

/**
 * Defines parameters for understanding the logical structure of data contents.
 */
export interface DataShape {
	/**
	 * Data orientation.
	 * Default: "values" is the only valid option if the format is csv, "records" is default if JSON.
	 */
	orientation?: DataOrientation
	/**
	 * Defines the expected nature of the dataset
	 */
	nature?: DataNature
	/**
	 * Defines the Row x Column layout of a raw list of values (e.g., a pandas Series).
     * For example,
        {
            data: [1,2,3,4,5,6],
            shape: {
                matrix: [3, 2]
            }
        }
        is interpreted as table
        1 2
        3 4
        5 6
	 */
	matrix?: [number, number]
}
