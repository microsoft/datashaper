import { useCallback } from 'react'
import { useDataPackage } from './useDataPackage.js'

/**
 * Load a datapackage json from a URL
 *
 * @returns A callback to load a datapackage json from a URL
 */
export function useLoadDataPackage(): (url: string) => void {
	const dataPackage = useDataPackage()
	/**
	 * TODO: handle load from .zip extension
	 */
	return useCallback(
		(url: string): void => {
			void fetch(url)
				.then((res) => res.blob())
				.then((data) => {
					const files = new Map<string, Blob>()
					files.set('datapackage.json', data)
					return dataPackage.load(files)
				})
				.catch((err) =>
					console.error(`error loading datapackage from ${url}`, err),
				)
		},
		[dataPackage],
	)
}
