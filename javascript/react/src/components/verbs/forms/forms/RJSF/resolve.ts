import get from "lodash-es/get.js"

/**
 * Recursively resolves $ref in a JSON schema.
 * Note that this does not handle circular references.
 * @param schema 
 * @returns 
 */
export function resolve(schema: any) {
    // copy the schema so we don't mutate the original
    const schemaCopy = JSON.parse(JSON.stringify(schema)) // TODO: deep clone
    Object.entries(schemaCopy).forEach(([key, value]) => {
        schemaCopy[key] = walk(value, schemaCopy)
    })
	return schemaCopy
}


function walk(node: any, root: any) {
    if (typeof node === 'object') {
        if (node.$ref) {
            return getRef(node.$ref, root)
        }
        Object.entries(node).forEach(([key, value]) => {
            node[key] = walk(value, root)
        })
    }
    return node
}


function getRef(ref: string, root: any) {
    const path = ref.replace('#/', '').replaceAll('/', '.')
    return get(root, path)
}