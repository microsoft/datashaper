/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */


/**
 * Describes a basic binding between a field in the input data source and a property of a visual element.
 */
export interface DataFieldBinding {
	field?: string
}

/**
 * Describes the parameters to map a data field onto a numeric scale.
 */
export interface NumericFieldScaleBinding extends DataFieldBinding {
    /**
     * Domain of the input data (e.g., min/max values).
     */
	domain?: [number, number]
    /**
     * Output range to map to (e.g., min/max pixels on the display).
     */
	range?: [number, number]
}

// TODO: this is a very rudimentary start at a color binding
export interface ColorBinding extends DataFieldBinding {
    /**
     * Thematic color scale name.
     */
    scale?: string
}

/**
 * Describes the bindings between the fields necessary to render a point in cartesian space and the input data source.
 */
export interface CartesianPointBindings {
    /**
     * Bindings for the x position.
     */
	x?: DataFieldBinding
    /**
     * Bindings for the y position.
     */
	y?: DataFieldBinding
    /**
     * Bindings for the size of the point.
     */
	size?: NumericFieldScaleBinding

    fill?: ColorBinding
}
