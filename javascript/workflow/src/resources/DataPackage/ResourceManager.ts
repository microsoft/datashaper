/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataPackageSchema, Profile } from '@datashaper/schema'
import type { Observable } from 'rxjs'
import { BehaviorSubject, map } from 'rxjs'

import type { Resource } from '../Resource.js'
import type { ProfileHandler } from '../types.js'
import { LoadResourcesOperation } from './LoadResourcesOperation.js'
import { SaveResourcesOperation } from './SaveResourcesOperation.js'

export class ResourceManager {
	private _resourceByName: Map<string, Resource> = new Map()
	// TODO: this is really only a load-time concern.
	// we should probably move it to a new loader class
	private _resourceByPath = new Map<string, Resource>()
	private _files: Map<string, Blob> = new Map()
	private _resourceDisposables: Map<string, () => void> = new Map()

	private _topResources$ = new BehaviorSubject<Resource[]>([])
	private _topNames$ = this._topResources$.pipe(map(r => r.map(r => r.name)))
	private _topSize$ = this._topResources$.pipe(map(r => r.length))
	private _topIsEmpty$ = this._topResources$.pipe(map(r => r.length === 0))

	private _resources$ = new BehaviorSubject<Resource[]>([])
	private _names$ = this._resources$.pipe(map(r => r.map(r => r.name)))
	private _size$ = this._resources$.pipe(map(r => r.length))
	private _isEmpty$ = this._resources$.pipe(map(r => r.length === 0))

	private _profileHandlers = new Map<Profile, ProfileHandler>()

	public get profileHandlers(): Map<Profile, ProfileHandler> {
		return this._profileHandlers
	}

	/**
	 * The top-level resources observable
	 */
	public get topResources$(): Observable<Resource[]> {
		return this._topResources$
	}

	/**
	 * The top level resources
	 */
	public get topResources(): Resource[] {
		return this._topResources$.value
	}

	/**
	 * The top-level resource names observable
	 */
	public get topNames$(): Observable<string[]> {
		return this._topNames$
	}

	/**
	 * The top-level resource names
	 */
	public get topNames(): string[] {
		return this.topResources.map(r => r.name)
	}

	/**
	 * The top-level resource count
	 */
	public get topSize$(): Observable<number> {
		return this._topSize$
	}

	/**
	 * The top-level resource count
	 */
	public get topSize(): number {
		return this.topResources.length
	}

	/**
	 * Is the resource manager empty of resources - observable
	 */
	public get topIsEmpty$(): Observable<boolean> {
		return this._topIsEmpty$
	}

	/**
	 * Is the resource manager empty of resources
	 */
	public get topIsEmpty(): boolean {
		return this.size === 0
	}

	/**
	 * All resources observable
	 */
	public get resources$(): Observable<Resource[]> {
		return this._resources$
	}

	/**
	 * All resources
	 */
	public get resources(): Resource[] {
		return this._resources$.value
	}

	/**
	 * All resource names observable
	 */
	public get names$(): Observable<string[]> {
		return this._names$
	}

	public get names(): string[] {
		return this.resources.map(r => r.name)
	}

	/**
	 * The count of all resources observable
	 */
	public get size$(): Observable<number> {
		return this._size$
	}

	/**
	 * The count of all resources
	 */
	public get size(): number {
		return this.resources.length
	}

	/**
	 * Is the resource manager empty of resources - observable
	 */
	public get isEmpty$(): Observable<boolean> {
		return this._isEmpty$
	}

	/**
	 * Is the resource manager empty of resources
	 */
	public get isEmpty(): boolean {
		return this.size === 0
	}

	/**
	 * Reads a raw resource blob from the loaded archive
	 * @param path - The path to the resource
	 * @returns The raw blob of the read resource
	 */
	public readFile(path: string): Blob | undefined {
		return this._files.get(path)
	}

	/**
	 * Adds a new resource to track
	 * @param resource - The resource to add
	 */
	public addResource(resource: Resource, top: boolean): void {
		let name = resource.name
		if (
			this._resourceByName.has(name) &&
			this._resourceByName.get(name) !== resource
		) {
			throw new Error(`registering resource with duplicate name ${name}`)
		}

		const emitResource = () => {
			this._resources$.next([
				...this.resources.filter(t => t !== resource),
				resource,
			])
			if (top) {
				this._topResources$.next([
					...this.topResources.filter(t => t !== resource),
					resource,
				])
			}
		}

		this.registerResource(resource)
		emitResource()

		// re-file the resource by name when the resource changes
		this._resourceDisposables.set(
			resource.name,
			resource.onChange(() => {
				// handle name changes
				if (resource.name !== name) {
					this._resourceByName.delete(name)
					this.registerResource(resource)
					name = resource.name
					emitResource()
				}
			}),
		)

		resource.onChange(() => {
			this._topResources$.next(this.topResources)
			this._resources$.next(this.resources)
		})
		resource.onDispose(() => this.removeResource(resource.name))
	}

	/**
	 * Removes a resource from the resource management system
	 * @param name - The name of the resource to remove
	 */
	public removeResource(name: string): void {
		this._resourceDisposables.get(name)?.()
		this._resourceDisposables.delete(name)
		this._resources$.next(this.resources.filter(t => name !== t.name))
		this._topResources$.next(this.topResources.filter(t => name !== t.name))
	}

	/**
	 * Determines if a resource exists by name
	 * @param name - the name of the resource to check
	 * @returns Whether the resource exists
	 */
	public hasResource(name: string): boolean {
		return this._resourceByName.has(name)
	}

	/**
	 * Gets a resource by name
	 * @param name - the name of the resource to get
	 * @returns The resource or undefined if not found
	 */
	public getResource(name: string): Resource | undefined {
		return this._resourceByName.get(name)
	}

	/**
	 * Gets a resource by path
	 * @param path - the path of the resource to get
	 * @returns The resource or undefined if not found
	 */
	public getResourceByPath(path: string): Resource | undefined {
		return this._resourceByPath.get(path)
	}

	/**
	 * Register a new profile handle with the resource management system
	 *
	 * @param handler - The profile handler to register
	 */
	public registerProfile(handler: ProfileHandler): void {
		if (this._profileHandlers.has(handler.profile)) {
			console.warn(
				`A resource handler for profile '${handler.profile}' is already registered. Overriding existing entry.`,
			)
		}
		this._profileHandlers.set(handler.profile, handler)
	}

	/**
	 * Clear out the resource manager. The resources and filesystem will be cleared.
	 */
	public clear(): void {
		this._files.clear()
		this._resources$.next([])
		this._resourceByName.clear()
	}

	/**
	 * Resets the resource manager to a new set of files
	 *
	 * @param files - the archive to reset fromw
	 * @returns The loaded datapackage schema
	 */
	public async load(files: Map<string, Blob>): Promise<DataPackageSchema> {
		this.clear()
		this._files = files

		const [dataPackage, resources, topLevelResources] =
			await new LoadResourcesOperation(files, this).execute()

		this._resources$.next(resources)
		this._topResources$.next(topLevelResources)
		topLevelResources.forEach(r =>
			r.onChange(() => this._topResources$.next(this.topResources)),
		)
		return dataPackage
	}

	public save(files: Map<string, Blob>): Promise<string[]> {
		return new SaveResourcesOperation(this, files).execute()
	}

	public registerResource(resource: Resource, path?: string | undefined): void {
		const registeredResource = this._resourceByName.get(resource.name)
		if (registeredResource && registeredResource !== resource) {
			throw new Error(`duplicate resource name: ${resource.name}`)
		}
		this._resourceByName.set(resource.name, resource)

		if (path != null) {
			this._resourceByPath.set(path, resource)
		}
	}
}
