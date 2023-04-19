import { Observable } from 'rxjs'

/**
 * Implement this to signal that your resource is configurable.
 * Implementors must supply their own management of the config object/observable.
 * See the webapp's TestAppResource for an example.
 */
export interface Configurable<T = unknown> {
	config$: Observable<T>
	config: T
}
