export type ResourceConfig = {}

export interface Configurable<T extends ResourceConfig = ResourceConfig> {
	config: T
}
