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

export interface DataGraphCollection {
    /**
     * Name of the input containing the collection.
     * TODO: should this map generically to an Input?
     */
	input?: string
    /**
     * Identifier column for items in the collection.
     */
	identifier?: string
}

/**
 * Describes the data input and visual bindings for graph nodes.
 */
export interface DataGraphNodes extends DataGraphCollection {
    /**
     * Visual bindings for the nodes.
     */
	bindings?: CartesianPointBindings
}

/**
 * Describes the data input and visual bindings for graph edges.
 */
export interface DataGraphEdges extends DataGraphCollection {
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
	bindings?: CartesianLineBindings
}