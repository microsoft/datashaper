/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TextEncoder, TextDecoder } from 'util'
import {
	TransformStream,
	WritableStream,
	ReadableStream,
} from 'node:stream/web'
import 'cross-fetch/polyfill'
import Blob from 'cross-blob'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

globalThis.TransformStream = TransformStream
globalThis.WritableStream = WritableStream
globalThis.ReadableStream = ReadableStream
globalThis.Blob = Blob
