import path from 'path'
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { configure } from '@essex/storybook-config/main'

const configuration = configure({
	staticDirs: [path.join(__dirname, '../../react/src/__tests__/public')],
})

export default configuration
