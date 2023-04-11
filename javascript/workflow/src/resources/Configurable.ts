import { Observable } from 'rxjs'

export interface Configurable<T = unknown> {
	config$: Observable<T>
	config: T
}
