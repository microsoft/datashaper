/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

export const About: React.FC = memo(function About() {
	return (
		<div style={{ margin: 25 }}>
			<h1>Datashaper</h1>
			<p>
				The Datashaper project is a suite of tools for schema-based, declarative
				data manipulation. It is designed to be used in a variety of contexts,
				including JavaScript and Python.
			</p>
			<h2>Verb-Centric</h2>
			<p>
				At the heart of Datashaper is a set of verbs that describe kinds of data
				transformations that are applied to data-tables. These verbs can be
				chained together to form data worflows.
			</p>
			<h2>React API</h2>
			<p>
				Datashaper provides a React-based UI library for defining and
				configuring dataflows, and observing their outputs.
			</p>
			<h2>App Framework</h2>
			<p>
				Datashaper provides a React-based application framework for building
				schema-based data applications.
			</p>
		</div>
	)
})
