/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { configure } = require('@essex/storybook-config/main')
const path = require('path')

module.exports = configure({
	staticDirs: [path.join(__dirname, '../../react/src/__tests__/public')],
	transpileMatch: [/@datashaper/, /@essex/, /fetch-blob/],
})
