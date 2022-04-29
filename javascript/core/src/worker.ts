import { createPipeline } from './engine/DefaultPipeline.js'
import { createTableStore } from './store/createTableStore.js'

onmessage = (ev: MessageEvent) => {
	console.log('EVENT', ev)
	if (ev.data.type === 'STEPS_CHANGED') {
		const steps = ev.data.payload
		const store = createTableStore()
		const pipe = createPipeline(store)
		pipe.addAll(steps)

		pipe.run().then(res => {
			console.log('RES', res)
			postMessage({
				type: 'RUN_COMPLETE',
				payload: res,
			})
		})
	}
}
