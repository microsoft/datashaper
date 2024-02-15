/*! For license information please see 202.b2e73bd0.iframe.bundle.js.LICENSE.txt */
"use strict";(self.webpackChunk_datashaper_stories=self.webpackChunk_datashaper_stories||[]).push([[202],{"../../.yarn/__virtual__/@essex-components-virtual-8fb571eb4e/0/cache/@essex-components-npm-4.2.0-90f5c830ba-807e614d13.zip/node_modules/@essex/components/dist/EnumDropdown/EnumDropdown.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Y:()=>EnumDropdown});var jsx_runtime=__webpack_require__("../../.yarn/cache/react-npm-18.2.0-1eae08fee2-b9214a9bd7.zip/node_modules/react/jsx-runtime.js"),lib_commonjs=__webpack_require__("../../.yarn/__virtual__/@fluentui-react-virtual-b0efa69786/0/cache/@fluentui-react-npm-8.110.2-669ea1c8a4-df2ed3344f.zip/node_modules/@fluentui/react/lib-commonjs/index.js"),react=__webpack_require__("../../.yarn/cache/react-npm-18.2.0-1eae08fee2-b9214a9bd7.zip/node_modules/react/index.js");function useEnumDropdownOptions(enumeration,labels){return(0,react.useMemo)((()=>function getEnumDropdownOptions(enumeration,labels){return Object.entries(enumeration).map((entry=>{const[name,key]=entry,text=labels?.[key]||function formatEnumName(name){const parts=name.replace(/([A-Z])/g," $1").trim().split(/\s/);return[parts[0],...parts.slice(1).map((p=>p.toLocaleLowerCase()))].join(" ")}(name);return{key,text}}))}(enumeration,labels)),[enumeration,labels])}const EnumDropdown=(0,react.memo)((function EnumDropdown(props){const options=useEnumDropdownOptions(props.enumeration,props.labels);return(0,jsx_runtime.jsx)(lib_commonjs.Dropdown,{options,...props})}))},"../../.yarn/__virtual__/observable-hooks-virtual-a9893ed7ca/0/cache/observable-hooks-npm-4.2.3-58c1824e2e-b36c22f51e.zip/node_modules/observable-hooks/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{mA:()=>useObservable,pw:()=>useObservableState});var internal_BehaviorSubject=__webpack_require__("../../.yarn/cache/rxjs-npm-7.8.1-41c443a75b-b10cac1a52.zip/node_modules/rxjs/dist/esm5/internal/BehaviorSubject.js"),internal_Subject=__webpack_require__("../../.yarn/cache/rxjs-npm-7.8.1-41c443a75b-b10cac1a52.zip/node_modules/rxjs/dist/esm5/internal/Subject.js"),Observable=__webpack_require__("../../.yarn/cache/rxjs-npm-7.8.1-41c443a75b-b10cac1a52.zip/node_modules/rxjs/dist/esm5/internal/Observable.js"),isFunction=__webpack_require__("../../.yarn/cache/rxjs-npm-7.8.1-41c443a75b-b10cac1a52.zip/node_modules/rxjs/dist/esm5/internal/util/isFunction.js");var react=__webpack_require__("../../.yarn/cache/react-npm-18.2.0-1eae08fee2-b9214a9bd7.zip/node_modules/react/index.js");function useObservableInternal(useCustomEffect,init,inputs){if(!inputs)return(0,react.useState)(init)[0];const[inputs$]=(0,react.useState)((()=>new internal_BehaviorSubject.X(inputs))),[source$]=(0,react.useState)((()=>init(inputs$))),firstEffectRef=(0,react.useRef)(!0);return useCustomEffect((()=>{firstEffectRef.current?firstEffectRef.current=!1:inputs$.next(inputs)}),inputs),source$}function useObservable(init,inputs){return useObservableInternal(react.useEffect,init,inputs)}var getEmptySubject=()=>new internal_Subject.x,useIsomorphicLayoutEffect=(()=>"undefined"==typeof window?react.useEffect:react.useLayoutEffect)();var toObserver=args=>args[1]?.next?args[1]:{next:args[1],error:args[2],complete:args[3]};function useSubscriptionInternal(useCustomEffect,args){const argsRef=(0,react.useRef)(args),observerRef=(0,react.useRef)(),subscriptionRef=(0,react.useRef)();return useIsomorphicLayoutEffect((()=>{argsRef.current=args,observerRef.current=toObserver(args)})),useCustomEffect((()=>{const input$=argsRef.current[0];observerRef.current||(observerRef.current=toObserver(argsRef.current));const subscription=input$.subscribe({next:value=>{input$===argsRef.current[0]&&observerRef.current.next?.(value)},error:error=>{input$===argsRef.current[0]&&(observerRef.current.error?observerRef.current.error(error):console.error(error))},complete:()=>{input$===argsRef.current[0]&&observerRef.current.complete?.()}});return subscriptionRef.current=subscription,()=>{subscription.unsubscribe()}}),[args[0]]),subscriptionRef}function useSubscription(input$,observerOrNext$,error,complete){return useSubscriptionInternal(react.useEffect,[input$,observerOrNext$,error,complete])}function useObservableStateInternal(useSubscription2,state$OrInit,initialState){if(function isObservable(obj){return!!obj&&(obj instanceof Observable.y||(0,isFunction.m)(obj.lift)&&(0,isFunction.m)(obj.subscribe))}(state$OrInit)){const state$=state$OrInit,[state,setState]=(0,react.useState)((()=>state$ instanceof internal_BehaviorSubject.X||void 0!==state$.value?state$.value:"function"==typeof initialState?initialState():initialState));return useSubscription2(state$,setState),(0,react.useDebugValue)(state),state}{const init=state$OrInit,[state,setState]=(0,react.useState)(initialState),[input$]=(0,react.useState)(getEmptySubject),[state$]=(0,react.useState)((()=>init(input$,state))),callback=(0,react.useRef)((state2=>input$.next(state2))).current;return useSubscription2(state$,setState),(0,react.useDebugValue)(state),[state,callback]}}function useObservableState(state$OrInit,initialState){return useObservableStateInternal(useSubscription,state$OrInit,initialState)}},"../../.yarn/cache/lodash-es-npm-4.17.21-b45832dfce-03f39878ea.zip/node_modules/lodash-es/cloneDeep.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>lodash_es_cloneDeep});var _Stack=__webpack_require__("../../.yarn/cache/lodash-es-npm-4.17.21-b45832dfce-03f39878ea.zip/node_modules/lodash-es/_Stack.js");const _arrayEach=function arrayEach(array,iteratee){for(var index=-1,length=null==array?0:array.length;++index<length&&!1!==iteratee(array[index],index,array););return array};var _assignValue=__webpack_require__("../../.yarn/cache/lodash-es-npm-4.17.21-b45832dfce-03f39878ea.zip/node_modules/lodash-es/_assignValue.js"),_copyObject=__webpack_require__("../../.yarn/cache/lodash-es-npm-4.17.21-b45832dfce-03f39878ea.zip/node_modules/lodash-es/_copyObject.js"),keys=__webpack_require__("../../.yarn/cache/lodash-es-npm-4.17.21-b45832dfce-03f39878ea.zip/node_modules/lodash-es/keys.js");const _baseAssign=function baseAssign(object,source){return object&&(0,_copyObject.Z)(source,(0,keys.Z)(source),object)};var keysIn=__webpack_require__("../../.yarn/cache/lodash-es-npm-4.17.21-b45832dfce-03f39878ea.zip/node_modules/lodash-es/keysIn.js");const _baseAssignIn=function baseAssignIn(object,source){return object&&(0,_copyObject.Z)(source,(0,keysIn.Z)(source),object)};var _cloneBuffer=__webpack_require__("../../.yarn/cache/lodash-es-npm-4.17.21-b45832dfce-03f39878ea.zip/node_modules/lodash-es/_cloneBuffer.js"),_copyArray=__webpack_require__("../../.yarn/cache/lodash-es-npm-4.17.21-b45832dfce-03f39878ea.zip/node_modules/lodash-es/_copyArray.js"),_getSymbols=__webpack_require__("../../.yarn/cache/lodash-es-npm-4.17.21-b45832dfce-03f39878ea.zip/node_modules/lodash-es/_getSymbols.js");const _copySymbols=function copySymbols(source,object){return(0,_copyObject.Z)(source,(0,_getSymbols.Z)(source),object)};var _arrayPush=__webpack_require__("../../.yarn/cache/lodash-es-npm-4.17.21-b45832dfce-03f39878ea.zip/node_modules/lodash-es/_arrayPush.js"),_getPrototype=__webpack_require__("../../.yarn/cache/lodash-es-npm-4.17.21-b45832dfce-03f39878ea.zip/node_modules/lodash-es/_getPrototype.js"),stubArray=__webpack_require__("../../.yarn/cache/lodash-es-npm-4.17.21-b45832dfce-03f39878ea.zip/node_modules/lodash-es/stubArray.js");const _getSymbolsIn=Object.getOwnPropertySymbols?function(object){for(var result=[];object;)(0,_arrayPush.Z)(result,(0,_getSymbols.Z)(object)),object=(0,_getPrototype.Z)(object);return result}:stubArray.Z;const _copySymbolsIn=function copySymbolsIn(source,object){return(0,_copyObject.Z)(source,_getSymbolsIn(source),object)};var _getAllKeys=__webpack_require__("../../.yarn/cache/lodash-es-npm-4.17.21-b45832dfce-03f39878ea.zip/node_modules/lodash-es/_getAllKeys.js"),_baseGetAllKeys=__webpack_require__("../../.yarn/cache/lodash-es-npm-4.17.21-b45832dfce-03f39878ea.zip/node_modules/lodash-es/_baseGetAllKeys.js");const _getAllKeysIn=function getAllKeysIn(object){return(0,_baseGetAllKeys.Z)(object,keysIn.Z,_getSymbolsIn)};var _getTag=__webpack_require__("../../.yarn/cache/lodash-es-npm-4.17.21-b45832dfce-03f39878ea.zip/node_modules/lodash-es/_getTag.js"),_initCloneArray_hasOwnProperty=Object.prototype.hasOwnProperty;const _initCloneArray=function initCloneArray(array){var length=array.length,result=new array.constructor(length);return length&&"string"==typeof array[0]&&_initCloneArray_hasOwnProperty.call(array,"index")&&(result.index=array.index,result.input=array.input),result};var _cloneArrayBuffer=__webpack_require__("../../.yarn/cache/lodash-es-npm-4.17.21-b45832dfce-03f39878ea.zip/node_modules/lodash-es/_cloneArrayBuffer.js");const _cloneDataView=function cloneDataView(dataView,isDeep){var buffer=isDeep?(0,_cloneArrayBuffer.Z)(dataView.buffer):dataView.buffer;return new dataView.constructor(buffer,dataView.byteOffset,dataView.byteLength)};var reFlags=/\w*$/;const _cloneRegExp=function cloneRegExp(regexp){var result=new regexp.constructor(regexp.source,reFlags.exec(regexp));return result.lastIndex=regexp.lastIndex,result};var _Symbol=__webpack_require__("../../.yarn/cache/lodash-es-npm-4.17.21-b45832dfce-03f39878ea.zip/node_modules/lodash-es/_Symbol.js"),symbolProto=_Symbol.Z?_Symbol.Z.prototype:void 0,symbolValueOf=symbolProto?symbolProto.valueOf:void 0;const _cloneSymbol=function cloneSymbol(symbol){return symbolValueOf?Object(symbolValueOf.call(symbol)):{}};var _cloneTypedArray=__webpack_require__("../../.yarn/cache/lodash-es-npm-4.17.21-b45832dfce-03f39878ea.zip/node_modules/lodash-es/_cloneTypedArray.js");const _initCloneByTag=function initCloneByTag(object,tag,isDeep){var Ctor=object.constructor;switch(tag){case"[object ArrayBuffer]":return(0,_cloneArrayBuffer.Z)(object);case"[object Boolean]":case"[object Date]":return new Ctor(+object);case"[object DataView]":return _cloneDataView(object,isDeep);case"[object Float32Array]":case"[object Float64Array]":case"[object Int8Array]":case"[object Int16Array]":case"[object Int32Array]":case"[object Uint8Array]":case"[object Uint8ClampedArray]":case"[object Uint16Array]":case"[object Uint32Array]":return(0,_cloneTypedArray.Z)(object,isDeep);case"[object Map]":case"[object Set]":return new Ctor;case"[object Number]":case"[object String]":return new Ctor(object);case"[object RegExp]":return _cloneRegExp(object);case"[object Symbol]":return _cloneSymbol(object)}};var _initCloneObject=__webpack_require__("../../.yarn/cache/lodash-es-npm-4.17.21-b45832dfce-03f39878ea.zip/node_modules/lodash-es/_initCloneObject.js"),isArray=__webpack_require__("../../.yarn/cache/lodash-es-npm-4.17.21-b45832dfce-03f39878ea.zip/node_modules/lodash-es/isArray.js"),isBuffer=__webpack_require__("../../.yarn/cache/lodash-es-npm-4.17.21-b45832dfce-03f39878ea.zip/node_modules/lodash-es/isBuffer.js"),isObjectLike=__webpack_require__("../../.yarn/cache/lodash-es-npm-4.17.21-b45832dfce-03f39878ea.zip/node_modules/lodash-es/isObjectLike.js");const _baseIsMap=function baseIsMap(value){return(0,isObjectLike.Z)(value)&&"[object Map]"==(0,_getTag.Z)(value)};var _baseUnary=__webpack_require__("../../.yarn/cache/lodash-es-npm-4.17.21-b45832dfce-03f39878ea.zip/node_modules/lodash-es/_baseUnary.js"),_nodeUtil=__webpack_require__("../../.yarn/cache/lodash-es-npm-4.17.21-b45832dfce-03f39878ea.zip/node_modules/lodash-es/_nodeUtil.js"),nodeIsMap=_nodeUtil.Z&&_nodeUtil.Z.isMap;const lodash_es_isMap=nodeIsMap?(0,_baseUnary.Z)(nodeIsMap):_baseIsMap;var isObject=__webpack_require__("../../.yarn/cache/lodash-es-npm-4.17.21-b45832dfce-03f39878ea.zip/node_modules/lodash-es/isObject.js");const _baseIsSet=function baseIsSet(value){return(0,isObjectLike.Z)(value)&&"[object Set]"==(0,_getTag.Z)(value)};var nodeIsSet=_nodeUtil.Z&&_nodeUtil.Z.isSet;const lodash_es_isSet=nodeIsSet?(0,_baseUnary.Z)(nodeIsSet):_baseIsSet;var cloneableTags={};cloneableTags["[object Arguments]"]=cloneableTags["[object Array]"]=cloneableTags["[object ArrayBuffer]"]=cloneableTags["[object DataView]"]=cloneableTags["[object Boolean]"]=cloneableTags["[object Date]"]=cloneableTags["[object Float32Array]"]=cloneableTags["[object Float64Array]"]=cloneableTags["[object Int8Array]"]=cloneableTags["[object Int16Array]"]=cloneableTags["[object Int32Array]"]=cloneableTags["[object Map]"]=cloneableTags["[object Number]"]=cloneableTags["[object Object]"]=cloneableTags["[object RegExp]"]=cloneableTags["[object Set]"]=cloneableTags["[object String]"]=cloneableTags["[object Symbol]"]=cloneableTags["[object Uint8Array]"]=cloneableTags["[object Uint8ClampedArray]"]=cloneableTags["[object Uint16Array]"]=cloneableTags["[object Uint32Array]"]=!0,cloneableTags["[object Error]"]=cloneableTags["[object Function]"]=cloneableTags["[object WeakMap]"]=!1;const _baseClone=function baseClone(value,bitmask,customizer,key,object,stack){var result,isDeep=1&bitmask,isFlat=2&bitmask,isFull=4&bitmask;if(customizer&&(result=object?customizer(value,key,object,stack):customizer(value)),void 0!==result)return result;if(!(0,isObject.Z)(value))return value;var isArr=(0,isArray.Z)(value);if(isArr){if(result=_initCloneArray(value),!isDeep)return(0,_copyArray.Z)(value,result)}else{var tag=(0,_getTag.Z)(value),isFunc="[object Function]"==tag||"[object GeneratorFunction]"==tag;if((0,isBuffer.Z)(value))return(0,_cloneBuffer.Z)(value,isDeep);if("[object Object]"==tag||"[object Arguments]"==tag||isFunc&&!object){if(result=isFlat||isFunc?{}:(0,_initCloneObject.Z)(value),!isDeep)return isFlat?_copySymbolsIn(value,_baseAssignIn(result,value)):_copySymbols(value,_baseAssign(result,value))}else{if(!cloneableTags[tag])return object?value:{};result=_initCloneByTag(value,tag,isDeep)}}stack||(stack=new _Stack.Z);var stacked=stack.get(value);if(stacked)return stacked;stack.set(value,result),lodash_es_isSet(value)?value.forEach((function(subValue){result.add(baseClone(subValue,bitmask,customizer,subValue,value,stack))})):lodash_es_isMap(value)&&value.forEach((function(subValue,key){result.set(key,baseClone(subValue,bitmask,customizer,key,value,stack))}));var keysFunc=isFull?isFlat?_getAllKeysIn:_getAllKeys.Z:isFlat?keysIn.Z:keys.Z,props=isArr?void 0:keysFunc(value);return _arrayEach(props||value,(function(subValue,key){props&&(subValue=value[key=subValue]),(0,_assignValue.Z)(result,key,baseClone(subValue,bitmask,customizer,key,value,stack))})),result};const lodash_es_cloneDeep=function cloneDeep(value){return _baseClone(value,5)}}}]);