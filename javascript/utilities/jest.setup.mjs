/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TextEncoder, TextDecoder } from 'util'
import fetch from 'node-fetch'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.fetch = fetch
