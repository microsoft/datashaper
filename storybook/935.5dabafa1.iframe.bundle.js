"use strict";(self.webpackChunk_datashaper_stories=self.webpackChunk_datashaper_stories||[]).push([[935],{"../../.yarn/__virtual__/react-if-virtual-6e50bc3d5c/0/cache/react-if-npm-4.1.4-95583751aa-ba7e40fd2d.zip/node_modules/react-if/dist/react-if.esm.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{If:()=>If,JZ:()=>Case,Ot:()=>Else,Zf:()=>Then,gA:()=>Default,nA:()=>When,rs:()=>Switch});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../../.yarn/cache/react-npm-18.2.0-1eae08fee2-b9214a9bd7.zip/node_modules/react/index.js"),render=function render(props){return"function"==typeof props.children?react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,props.children()):react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,props.children||null)},Case=function Case(props){return render(props)};Case.defaultProps={children:null};var Default=function Default(props){return render(props)};Default.defaultProps={children:null};var Else=function Else(props){return render(props)},Fallback=function Fallback(props){return render(props)},getConditionResult=function getConditionResult(condition){return Boolean("function"==typeof condition?condition():condition)};function asyncGeneratorStep(gen,resolve,reject,_next,_throw,key,arg){try{var info=gen[key](arg),value=info.value}catch(error){return void reject(error)}info.done?resolve(value):Promise.resolve(value).then(_next,_throw)}function _asyncToGenerator(fn){return function(){var self=this,args=arguments;return new Promise((function(resolve,reject){var gen=fn.apply(self,args);function _next(value){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"next",value)}function _throw(err){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"throw",err)}_next(void 0)}))}}function _extends(){return _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}var runtime_1=function createCommonjsModule(fn,module){return fn(module={exports:{}},module.exports),module.exports}((function(module){var runtime=function(exports){var Op=Object.prototype,hasOwn=Op.hasOwnProperty,$Symbol="function"==typeof Symbol?Symbol:{},iteratorSymbol=$Symbol.iterator||"@@iterator",asyncIteratorSymbol=$Symbol.asyncIterator||"@@asyncIterator",toStringTagSymbol=$Symbol.toStringTag||"@@toStringTag";function define(obj,key,value){return Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}),obj[key]}try{define({},"")}catch(err){define=function(obj,key,value){return obj[key]=value}}function wrap(innerFn,outerFn,self,tryLocsList){var protoGenerator=outerFn&&outerFn.prototype instanceof Generator?outerFn:Generator,generator=Object.create(protoGenerator.prototype),context=new Context(tryLocsList||[]);return generator._invoke=function makeInvokeMethod(innerFn,self,context){var state="suspendedStart";return function invoke(method,arg){if("executing"===state)throw new Error("Generator is already running");if("completed"===state){if("throw"===method)throw arg;return doneResult()}for(context.method=method,context.arg=arg;;){var delegate=context.delegate;if(delegate){var delegateResult=maybeInvokeDelegate(delegate,context);if(delegateResult){if(delegateResult===ContinueSentinel)continue;return delegateResult}}if("next"===context.method)context.sent=context._sent=context.arg;else if("throw"===context.method){if("suspendedStart"===state)throw state="completed",context.arg;context.dispatchException(context.arg)}else"return"===context.method&&context.abrupt("return",context.arg);state="executing";var record=tryCatch(innerFn,self,context);if("normal"===record.type){if(state=context.done?"completed":"suspendedYield",record.arg===ContinueSentinel)continue;return{value:record.arg,done:context.done}}"throw"===record.type&&(state="completed",context.method="throw",context.arg=record.arg)}}}(innerFn,self,context),generator}function tryCatch(fn,obj,arg){try{return{type:"normal",arg:fn.call(obj,arg)}}catch(err){return{type:"throw",arg:err}}}exports.wrap=wrap;var ContinueSentinel={};function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}var IteratorPrototype={};define(IteratorPrototype,iteratorSymbol,(function(){return this}));var getProto=Object.getPrototypeOf,NativeIteratorPrototype=getProto&&getProto(getProto(values([])));NativeIteratorPrototype&&NativeIteratorPrototype!==Op&&hasOwn.call(NativeIteratorPrototype,iteratorSymbol)&&(IteratorPrototype=NativeIteratorPrototype);var Gp=GeneratorFunctionPrototype.prototype=Generator.prototype=Object.create(IteratorPrototype);function defineIteratorMethods(prototype){["next","throw","return"].forEach((function(method){define(prototype,method,(function(arg){return this._invoke(method,arg)}))}))}function AsyncIterator(generator,PromiseImpl){function invoke(method,arg,resolve,reject){var record=tryCatch(generator[method],generator,arg);if("throw"!==record.type){var result=record.arg,value=result.value;return value&&"object"==typeof value&&hasOwn.call(value,"__await")?PromiseImpl.resolve(value.__await).then((function(value){invoke("next",value,resolve,reject)}),(function(err){invoke("throw",err,resolve,reject)})):PromiseImpl.resolve(value).then((function(unwrapped){result.value=unwrapped,resolve(result)}),(function(error){return invoke("throw",error,resolve,reject)}))}reject(record.arg)}var previousPromise;this._invoke=function enqueue(method,arg){function callInvokeWithMethodAndArg(){return new PromiseImpl((function(resolve,reject){invoke(method,arg,resolve,reject)}))}return previousPromise=previousPromise?previousPromise.then(callInvokeWithMethodAndArg,callInvokeWithMethodAndArg):callInvokeWithMethodAndArg()}}function maybeInvokeDelegate(delegate,context){var method=delegate.iterator[context.method];if(undefined===method){if(context.delegate=null,"throw"===context.method){if(delegate.iterator.return&&(context.method="return",context.arg=undefined,maybeInvokeDelegate(delegate,context),"throw"===context.method))return ContinueSentinel;context.method="throw",context.arg=new TypeError("The iterator does not provide a 'throw' method")}return ContinueSentinel}var record=tryCatch(method,delegate.iterator,context.arg);if("throw"===record.type)return context.method="throw",context.arg=record.arg,context.delegate=null,ContinueSentinel;var info=record.arg;return info?info.done?(context[delegate.resultName]=info.value,context.next=delegate.nextLoc,"return"!==context.method&&(context.method="next",context.arg=undefined),context.delegate=null,ContinueSentinel):info:(context.method="throw",context.arg=new TypeError("iterator result is not an object"),context.delegate=null,ContinueSentinel)}function pushTryEntry(locs){var entry={tryLoc:locs[0]};1 in locs&&(entry.catchLoc=locs[1]),2 in locs&&(entry.finallyLoc=locs[2],entry.afterLoc=locs[3]),this.tryEntries.push(entry)}function resetTryEntry(entry){var record=entry.completion||{};record.type="normal",delete record.arg,entry.completion=record}function Context(tryLocsList){this.tryEntries=[{tryLoc:"root"}],tryLocsList.forEach(pushTryEntry,this),this.reset(!0)}function values(iterable){if(iterable){var iteratorMethod=iterable[iteratorSymbol];if(iteratorMethod)return iteratorMethod.call(iterable);if("function"==typeof iterable.next)return iterable;if(!isNaN(iterable.length)){var i=-1,next=function next(){for(;++i<iterable.length;)if(hasOwn.call(iterable,i))return next.value=iterable[i],next.done=!1,next;return next.value=undefined,next.done=!0,next};return next.next=next}}return{next:doneResult}}function doneResult(){return{value:undefined,done:!0}}return GeneratorFunction.prototype=GeneratorFunctionPrototype,define(Gp,"constructor",GeneratorFunctionPrototype),define(GeneratorFunctionPrototype,"constructor",GeneratorFunction),GeneratorFunction.displayName=define(GeneratorFunctionPrototype,toStringTagSymbol,"GeneratorFunction"),exports.isGeneratorFunction=function(genFun){var ctor="function"==typeof genFun&&genFun.constructor;return!!ctor&&(ctor===GeneratorFunction||"GeneratorFunction"===(ctor.displayName||ctor.name))},exports.mark=function(genFun){return Object.setPrototypeOf?Object.setPrototypeOf(genFun,GeneratorFunctionPrototype):(genFun.__proto__=GeneratorFunctionPrototype,define(genFun,toStringTagSymbol,"GeneratorFunction")),genFun.prototype=Object.create(Gp),genFun},exports.awrap=function(arg){return{__await:arg}},defineIteratorMethods(AsyncIterator.prototype),define(AsyncIterator.prototype,asyncIteratorSymbol,(function(){return this})),exports.AsyncIterator=AsyncIterator,exports.async=function(innerFn,outerFn,self,tryLocsList,PromiseImpl){void 0===PromiseImpl&&(PromiseImpl=Promise);var iter=new AsyncIterator(wrap(innerFn,outerFn,self,tryLocsList),PromiseImpl);return exports.isGeneratorFunction(outerFn)?iter:iter.next().then((function(result){return result.done?result.value:iter.next()}))},defineIteratorMethods(Gp),define(Gp,toStringTagSymbol,"Generator"),define(Gp,iteratorSymbol,(function(){return this})),define(Gp,"toString",(function(){return"[object Generator]"})),exports.keys=function(object){var keys=[];for(var key in object)keys.push(key);return keys.reverse(),function next(){for(;keys.length;){var key=keys.pop();if(key in object)return next.value=key,next.done=!1,next}return next.done=!0,next}},exports.values=values,Context.prototype={constructor:Context,reset:function(skipTempReset){if(this.prev=0,this.next=0,this.sent=this._sent=undefined,this.done=!1,this.delegate=null,this.method="next",this.arg=undefined,this.tryEntries.forEach(resetTryEntry),!skipTempReset)for(var name in this)"t"===name.charAt(0)&&hasOwn.call(this,name)&&!isNaN(+name.slice(1))&&(this[name]=undefined)},stop:function(){this.done=!0;var rootRecord=this.tryEntries[0].completion;if("throw"===rootRecord.type)throw rootRecord.arg;return this.rval},dispatchException:function(exception){if(this.done)throw exception;var context=this;function handle(loc,caught){return record.type="throw",record.arg=exception,context.next=loc,caught&&(context.method="next",context.arg=undefined),!!caught}for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i],record=entry.completion;if("root"===entry.tryLoc)return handle("end");if(entry.tryLoc<=this.prev){var hasCatch=hasOwn.call(entry,"catchLoc"),hasFinally=hasOwn.call(entry,"finallyLoc");if(hasCatch&&hasFinally){if(this.prev<entry.catchLoc)return handle(entry.catchLoc,!0);if(this.prev<entry.finallyLoc)return handle(entry.finallyLoc)}else if(hasCatch){if(this.prev<entry.catchLoc)return handle(entry.catchLoc,!0)}else{if(!hasFinally)throw new Error("try statement without catch or finally");if(this.prev<entry.finallyLoc)return handle(entry.finallyLoc)}}}},abrupt:function(type,arg){for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i];if(entry.tryLoc<=this.prev&&hasOwn.call(entry,"finallyLoc")&&this.prev<entry.finallyLoc){var finallyEntry=entry;break}}finallyEntry&&("break"===type||"continue"===type)&&finallyEntry.tryLoc<=arg&&arg<=finallyEntry.finallyLoc&&(finallyEntry=null);var record=finallyEntry?finallyEntry.completion:{};return record.type=type,record.arg=arg,finallyEntry?(this.method="next",this.next=finallyEntry.finallyLoc,ContinueSentinel):this.complete(record)},complete:function(record,afterLoc){if("throw"===record.type)throw record.arg;return"break"===record.type||"continue"===record.type?this.next=record.arg:"return"===record.type?(this.rval=this.arg=record.arg,this.method="return",this.next="end"):"normal"===record.type&&afterLoc&&(this.next=afterLoc),ContinueSentinel},finish:function(finallyLoc){for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i];if(entry.finallyLoc===finallyLoc)return this.complete(entry.completion,entry.afterLoc),resetTryEntry(entry),ContinueSentinel}},catch:function(tryLoc){for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i];if(entry.tryLoc===tryLoc){var record=entry.completion;if("throw"===record.type){var thrown=record.arg;resetTryEntry(entry)}return thrown}}throw new Error("illegal catch attempt")},delegateYield:function(iterable,resultName,nextLoc){return this.delegate={iterator:values(iterable),resultName,nextLoc},"next"===this.method&&(this.arg=undefined),ContinueSentinel}},exports}(module.exports);try{regeneratorRuntime=runtime}catch(accidentalStrictMode){"object"==typeof globalThis?globalThis.regeneratorRuntime=runtime:Function("r","regeneratorRuntime = r")(runtime)}}));function isFunction(input){return"function"==typeof input}function isThenable(input){return"object"==typeof input&&null!==input&&(input instanceof Promise||input!==Promise.prototype&&function hasThen(input){return Reflect.has(input,"then")&&isFunction(input.then)}(input)&&function hasCatch(input){return Reflect.has(input,"catch")&&isFunction(input.catch)}(input))}var useSingleton=function useSingleton(callback,dependencies){void 0===dependencies&&(dependencies=[]);var hasRan=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1),lastDependencies=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)([]);if("function"!=typeof callback)throw new Error("Incorrect callback parameter for useSingleton hook; expected a function, but got: '"+typeof callback+"'.");if(!Array.isArray(dependencies))throw new Error("Incorrect dependencies parameter for useSingleton; expected an array, but got: '"+typeof dependencies+"'.");if(Array.isArray(dependencies)&&dependencies.length>0){if(!function shallowArraysEqual(a,b){if(!Array.isArray(a)||!Array.isArray(b))throw new Error("shallowArraysEqual only accepts arrays as parameters");if(a.length!==b.length)return!1;for(var i=0;i<a.length;++i)if(a[i]!==b[i])return!1;return!0}(lastDependencies.current,dependencies))lastDependencies.current=dependencies;else if(hasRan.current)return}else if(hasRan.current)return;callback(),hasRan.current=!0},Then=function Then(props){return render(props)};function IfAsync(_ref){var promise=_ref.promise,_ref$keepAlive=_ref.keepAlive,keepAlive=void 0!==_ref$keepAlive&&_ref$keepAlive,children=_ref.children,_useState=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),isResolved=_useState[0],setIsResolved=_useState[1],_useState2=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),returnValue=_useState2[0],setReturnValue=_useState2[1],cancellablePromise=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)((function(){return function createCancellablePromise(promise){if(!isThenable(promise))throw new Error("Argument of createCancellablePromise should be a Promise");var isCancelled={value:!1},wrappedPromise=new Promise(function(){var _ref=_asyncToGenerator(runtime_1.mark((function _callee(res,rej){var d;return runtime_1.wrap((function _callee$(_context){for(;;)switch(_context.prev=_context.next){case 0:return _context.prev=0,_context.next=3,promise;case 3:return d=_context.sent,_context.abrupt("return",!isCancelled.value&&res(d));case 7:_context.prev=7,_context.t0=_context.catch(0),!isCancelled.value&&rej(_context.t0);case 10:case"end":return _context.stop()}}),_callee,null,[[0,7]])})));return function(_x,_x2){return _ref.apply(this,arguments)}}());return Object.keys(promise).forEach((function(key){wrappedPromise[key]=promise[key]})),{promise:wrappedPromise,cancel:function cancel(){isCancelled.value=!0}}}(promise)}),[promise]),history=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)([]);if((0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((function(){return function(){keepAlive||cancellablePromise.cancel()}}),[cancellablePromise,cancellablePromise.promise,keepAlive]),useSingleton(_asyncToGenerator(runtime_1.mark((function _callee(){var data;return runtime_1.wrap((function _callee$(_context){for(;;)switch(_context.prev=_context.next){case 0:return setIsResolved(null),setReturnValue(null),_context.prev=2,_context.next=5,cancellablePromise.promise;case 5:data=_context.sent,setReturnValue(data),setIsResolved(!0),history.current.push(cancellablePromise),_context.next=16;break;case 11:_context.prev=11,_context.t0=_context.catch(2),setReturnValue(_context.t0),setIsResolved(!1),history.current.push(cancellablePromise);case 16:case"end":return _context.stop()}}),_callee,null,[[2,11]])}))),[cancellablePromise.promise]),!children||!isThenable(promise))return null;if(null===isResolved){var hasFallback=react__WEBPACK_IMPORTED_MODULE_0__.Children.toArray(children).find((function(c){return c.type===Fallback}));return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,hasFallback||null)}if(!isResolved){var hasElse=react__WEBPACK_IMPORTED_MODULE_0__.Children.toArray(children).find((function(c){return c.type===Else}));if(!hasElse)return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,null);var elseElement=hasElse;return"function"==typeof hasElse.props.children&&(elseElement=_extends({},hasElse,{props:_extends({},hasElse.props,{children:function children(){return hasElse.props.children(returnValue,history.current,cancellablePromise.promise)}})})),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,elseElement)}var hasThen=react__WEBPACK_IMPORTED_MODULE_0__.Children.toArray(children).find((function(c){return c.type===Then}));if(!hasThen)return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,null);var thenElement=hasThen;return"function"==typeof hasThen.props.children&&(thenElement=_extends({},hasThen,{props:_extends({},hasThen.props,{children:function children(){return hasThen.props.children(returnValue,history.current,cancellablePromise.promise)}})})),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,thenElement)}var If=function If(_ref){var condition=_ref.condition,_ref$keepAlive=_ref.keepAlive,keepAlive=void 0!==_ref$keepAlive&&_ref$keepAlive,children=_ref.children;if(!children)return null;if(!Array.isArray(children)&&!(children.type===Else||children.type===Then)||react__WEBPACK_IMPORTED_MODULE_0__.Children.toArray(children).every((function(child){return child.type===Else||child.type===Then||child.type===Fallback})),isThenable(condition))return react__WEBPACK_IMPORTED_MODULE_0__.createElement(IfAsync,{promise:condition,keepAlive},children);var conditionResult=getConditionResult(condition);return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0__.Children.toArray(children).find((function(c){return c.type!==Else!=!conditionResult}))||null)},Switch=function Switch(_ref){var _ref2,_matchingCase,children=_ref.children,matchingCase=void 0,defaultCase=void 0;return isFunction(children)&&(children=children()),react__WEBPACK_IMPORTED_MODULE_0__.Children.forEach(children,(function(child){if(react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(child))if(matchingCase||child.type!==Case)defaultCase||child.type!==Default||(defaultCase=child);else{var condition=child.props.condition;getConditionResult(condition)&&(matchingCase=child)}})),null!=(_ref2=null!=(_matchingCase=matchingCase)?_matchingCase:defaultCase)?_ref2:null},When=function When(_ref){var condition=_ref.condition,children=_ref.children;return Boolean(getConditionResult(condition))&&children?render({children}):null};When.defaultProps={children:null}}}]);