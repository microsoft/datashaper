/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { readFile, readdir, mkdir, writeFile, rmdir } from 'fs/promises'

interface FileProps {
	name: string
	path: string
}

async function createDocFile(file: FileProps, outputDir: string) {
	const { name, path } = file
	const content = await readFile(path, 'utf-8')
	const jsFile = `const content = ${JSON.stringify(
		content,
	)} \nexport default content`
	return writeFile(`${outputDir}/${name}`, jsFile)
}

export async function removeDir(dir: string): Promise<void> {
	return rmdir(dir, { recursive: true })
}

export function changeFileExt(name: string, newExt = 'ts'): string {
	const ext = name.split('.').pop() || ''
	return name.replace(ext, newExt)
}

async function createDocs(files: FileProps[], outputDir: string) {
	for await (const file of files) {
		createDocFile(file, outputDir)
	}
}

function nonReservedWord(name: string) {
	switch (name) {
		case 'break':
		case 'case':
		case 'catch':
		case 'class':
		case 'const':
		case 'continue':
		case 'debugger':
		case 'default':
		case 'delete':
		case 'do':
		case 'fetch':
		case 'for':
		case 'function':
		case 'if':
		case 'import':
		case 'in':
		case 'instanceof':
		case 'let':
		case 'new':
		case 'return':
		case 'super':
		case 'switch':
			return `_${name}`
		default:
			return name
	}
}

async function createIndex(files: string[], outputDir: string) {
	let index = `/*!
* Copyright (c) Microsoft. All rights reserved.
* Licensed under the MIT license. See LICENSE file in the project.
*/\n
`

	const docs: Record<string, string> = {}
	files.forEach(file => {
		const constName = file.replace(/.(t|j)s$/, '')
		const safeName = nonReservedWord(constName)
		index += `import ${safeName} from './${file}'\n`
		docs[constName] = safeName
	})

	index += `
export const index = {\n${Object.keys(docs)
		.map(v => `\t"${v}": ${docs[v]}`)
		.join(',\n')} \n}
`

	return writeFile(`${outputDir}/index.ts`, index)
}

async function init() {
	const docsPath = '../../docs/verbs'
	const outputDir = './src/docs'
	try {
		/* eslint-disable @essex/adjacent-await */
		await removeDir(outputDir)
		await mkdir(outputDir)
		const files = await readdir(docsPath)
		await createDocs(
			files.map((f: string) => ({
				path: `${docsPath}/${f}`,
				name: changeFileExt(f),
			})),
			outputDir,
		)
		await createIndex(
			files.map((f: string) => changeFileExt(f, 'js')),
			outputDir,
		)
	} catch (error) {
		console.log('Error:', error)
	}
}

init()
