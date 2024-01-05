/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceSchema } from '../datapackage/ResourceSchema.js'
import type { KnownProfile } from '../enums/index.js'
import type { CartesianLineBindings, CartesianPointBindings } from './bindings.js'

/**
 * Describes the properties of a data graph, i.e., network.
 */
export interface DataGraphSchema extends ResourceSchema {
	profile: KnownProfile.DataGraph
	/**
	 * Nodes descriptor.
	 */
	nodes: DataGraphNodes
	/**
	 * Edges descriptor.
	 */
	edges: DataGraphEdges
}

/**
 * Describes the data input and visual bindings for graph nodes.
 */
export interface DataGraphNodes {
    /**
     * Name of the input.
     * TODO: should this map generically to an Input?
     */
	input?: string
    /**
     * Identifier column for the nodes.
     */
	identifier?: string
    /**
     * Visual bindings for the nodes.
     */
	bindings: CartesianPointBindings
}

/**
 * Describes the data input and visual bindings for graph edges.
 */
export interface DataGraphEdges {
    /**
     * Name of the input.
     * TODO: should this map generically to an Input?
     */
	input?: string
    /**
     * Identifier column for the edges.
     */
	identifier?: string
	/**
	 * Column containing the source node id.
	 */
	source?: string
	/**
	 * Column containing the target node id.
	 */
	target?: string
	/**
	 * Visual bindings for the edges.
	 */
	bindings: CartesianLineBindings
}