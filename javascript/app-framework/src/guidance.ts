import content from '@datashaper/guidance'

/**
 * Retrieves specific guidance content from the shared guidance package.
 * Note that currently the markdown build script represents subfolders using '.',
 * so we replace those with the folder name prefix, in this case 'resources'.
 * Once the build script and MarkdownBrowser component is updated to support subfolders,
 * this prefix management will need updated.
 *
 * Also note that every resource in the core framework will register the same resource guidance.
 * This is to ensure that any profile can navigate the relative content. Duplicate registrations will be silently absorbed.
 * @returns
 */
export function guidance() {
	return Object.entries(content as Record<string, string>).reduce(
		(acc, [key, value]) => {
			if (key.startsWith('resources')) {
				acc[key.replace('resources.', '')] = value
			}
			return acc
		},
		{} as Record<string, string>,
	)
}
