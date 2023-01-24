/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TextDecoder, TextEncoder } from 'util'
import { File, Blob } from 'web-file-polyfill'
import 'cross-fetch/polyfill'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.Blob = Blob
global.File = File
