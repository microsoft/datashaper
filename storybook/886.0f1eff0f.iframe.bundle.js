/*! For license information please see 886.0f1eff0f.iframe.bundle.js.LICENSE.txt */
"use strict";(self.webpackChunk_datashaper_stories=self.webpackChunk_datashaper_stories||[]).push([[886],{"../../.yarn/__virtual__/@essex-components-virtual-8fb571eb4e/0/cache/@essex-components-npm-4.2.0-90f5c830ba-807e614d13.zip/node_modules/@essex/components/dist/MultiDropdown/MultiDropdown.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{j:()=>MultiDropdown});var jsx_runtime=__webpack_require__("../../.yarn/cache/react-npm-18.2.0-1eae08fee2-b9214a9bd7.zip/node_modules/react/jsx-runtime.js"),lib_commonjs=__webpack_require__("../../.yarn/__virtual__/@fluentui-react-virtual-b0efa69786/0/cache/@fluentui-react-npm-8.110.2-669ea1c8a4-df2ed3344f.zip/node_modules/@fluentui/react/lib-commonjs/index.js"),react=__webpack_require__("../../.yarn/cache/react-npm-18.2.0-1eae08fee2-b9214a9bd7.zip/node_modules/react/index.js");const wrapperStyle={display:"flex",justifyContent:"space-between",gap:4},linkStyles={root:{textAlign:"center",width:"100%"}},divider={key:"--divider--",text:"-",itemType:1,selected:!1},actions={key:"--actions--",text:"",itemType:2,selected:!1};const MultiDropdown=(0,react.memo)((function MultiDropdown({options,onChangeAll,...props}){const opts=function useDropdownOptions(options){return(0,react.useMemo)((()=>[actions,divider,...options]),[options])}(options),handleRenderOption=function useOptionRenderer(options,onChangeAll){const handleSelectAll=(0,react.useCallback)((event=>onChangeAll?.(event,options.map((o=>({...o,selected:!0}))),options.map(((_o,i)=>i)))),[onChangeAll,options]),handleSelectNone=(0,react.useCallback)((event=>onChangeAll?.(event)),[onChangeAll]);return(0,react.useCallback)((option=>"--actions--"===option?.key?(0,jsx_runtime.jsxs)("div",{style:wrapperStyle,children:[(0,jsx_runtime.jsx)(lib_commonjs.Link,{styles:linkStyles,onClick:handleSelectAll,children:"All"}),(0,jsx_runtime.jsx)(lib_commonjs.Separator,{vertical:!0}),(0,jsx_runtime.jsx)(lib_commonjs.Link,{styles:linkStyles,onClick:handleSelectNone,children:"None"})]}):(0,jsx_runtime.jsx)(jsx_runtime.Fragment,{children:option?.text})),[handleSelectAll,handleSelectNone])}(options,onChangeAll);return(0,jsx_runtime.jsx)(lib_commonjs.Dropdown,{multiSelect:!0,options:opts,onRenderOption:handleRenderOption,...props})}))},"../../.yarn/__virtual__/@essex-styled-components-virtual-7a9a1c8fa5/0/cache/@essex-styled-components-npm-0.0.13-b74877a32a-1397d77a45.zip/node_modules/@essex/styled-components/dist/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var styled_components__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../../.yarn/__virtual__/styled-components-virtual-1eea706064/0/cache/styled-components-npm-5.3.11-d45616b9af-7e1baee0f7.zip/node_modules/styled-components/dist/styled-components.browser.cjs.js");const __WEBPACK_DEFAULT_EXPORT__=styled_components__WEBPACK_IMPORTED_MODULE_0__.default.default??styled_components__WEBPACK_IMPORTED_MODULE_0__.default},"../../.yarn/cache/immer-npm-10.0.3-174ab52899-0be07be2f2.zip/node_modules/immer/dist/immer.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Uy:()=>produce});var NOTHING=Symbol.for("immer-nothing"),DRAFTABLE=Symbol.for("immer-draftable"),DRAFT_STATE=Symbol.for("immer-state");function die(error,...args){throw new Error(`[Immer] minified error nr: ${error}. Full error at: https://bit.ly/3cXEKWf`)}var getPrototypeOf=Object.getPrototypeOf;function isDraft(value){return!!value&&!!value[DRAFT_STATE]}function isDraftable(value){return!!value&&(isPlainObject(value)||Array.isArray(value)||!!value[DRAFTABLE]||!!value.constructor?.[DRAFTABLE]||isMap(value)||isSet(value))}var objectCtorString=Object.prototype.constructor.toString();function isPlainObject(value){if(!value||"object"!=typeof value)return!1;const proto=getPrototypeOf(value);if(null===proto)return!0;const Ctor=Object.hasOwnProperty.call(proto,"constructor")&&proto.constructor;return Ctor===Object||"function"==typeof Ctor&&Function.toString.call(Ctor)===objectCtorString}function each(obj,iter){0===getArchtype(obj)?Object.entries(obj).forEach((([key,value])=>{iter(key,value,obj)})):obj.forEach(((entry,index)=>iter(index,entry,obj)))}function getArchtype(thing){const state=thing[DRAFT_STATE];return state?state.type_:Array.isArray(thing)?1:isMap(thing)?2:isSet(thing)?3:0}function has(thing,prop){return 2===getArchtype(thing)?thing.has(prop):Object.prototype.hasOwnProperty.call(thing,prop)}function set(thing,propOrOldValue,value){const t=getArchtype(thing);2===t?thing.set(propOrOldValue,value):3===t?thing.add(value):thing[propOrOldValue]=value}function isMap(target){return target instanceof Map}function isSet(target){return target instanceof Set}function latest(state){return state.copy_||state.base_}function shallowCopy(base,strict){if(isMap(base))return new Map(base);if(isSet(base))return new Set(base);if(Array.isArray(base))return Array.prototype.slice.call(base);if(!strict&&isPlainObject(base)){if(!getPrototypeOf(base)){const obj=Object.create(null);return Object.assign(obj,base)}return{...base}}const descriptors=Object.getOwnPropertyDescriptors(base);delete descriptors[DRAFT_STATE];let keys=Reflect.ownKeys(descriptors);for(let i=0;i<keys.length;i++){const key=keys[i],desc=descriptors[key];!1===desc.writable&&(desc.writable=!0,desc.configurable=!0),(desc.get||desc.set)&&(descriptors[key]={configurable:!0,writable:!0,enumerable:desc.enumerable,value:base[key]})}return Object.create(getPrototypeOf(base),descriptors)}function freeze(obj,deep=!1){return isFrozen(obj)||isDraft(obj)||!isDraftable(obj)||(getArchtype(obj)>1&&(obj.set=obj.add=obj.clear=obj.delete=dontMutateFrozenCollections),Object.freeze(obj),deep&&each(obj,((_key,value)=>freeze(value,!0)))),obj}function dontMutateFrozenCollections(){die(2)}function isFrozen(obj){return Object.isFrozen(obj)}var currentScope,plugins={};function getPlugin(pluginKey){const plugin=plugins[pluginKey];return plugin||die(0),plugin}function getCurrentScope(){return currentScope}function usePatchesInScope(scope,patchListener){patchListener&&(getPlugin("Patches"),scope.patches_=[],scope.inversePatches_=[],scope.patchListener_=patchListener)}function revokeScope(scope){leaveScope(scope),scope.drafts_.forEach(revokeDraft),scope.drafts_=null}function leaveScope(scope){scope===currentScope&&(currentScope=scope.parent_)}function enterScope(immer2){return currentScope=function createScope(parent_,immer_){return{drafts_:[],parent_,immer_,canAutoFreeze_:!0,unfinalizedDrafts_:0}}(currentScope,immer2)}function revokeDraft(draft){const state=draft[DRAFT_STATE];0===state.type_||1===state.type_?state.revoke_():state.revoked_=!0}function processResult(result,scope){scope.unfinalizedDrafts_=scope.drafts_.length;const baseDraft=scope.drafts_[0];return void 0!==result&&result!==baseDraft?(baseDraft[DRAFT_STATE].modified_&&(revokeScope(scope),die(4)),isDraftable(result)&&(result=finalize(scope,result),scope.parent_||maybeFreeze(scope,result)),scope.patches_&&getPlugin("Patches").generateReplacementPatches_(baseDraft[DRAFT_STATE].base_,result,scope.patches_,scope.inversePatches_)):result=finalize(scope,baseDraft,[]),revokeScope(scope),scope.patches_&&scope.patchListener_(scope.patches_,scope.inversePatches_),result!==NOTHING?result:void 0}function finalize(rootScope,value,path){if(isFrozen(value))return value;const state=value[DRAFT_STATE];if(!state)return each(value,((key,childValue)=>finalizeProperty(rootScope,state,value,key,childValue,path))),value;if(state.scope_!==rootScope)return value;if(!state.modified_)return maybeFreeze(rootScope,state.base_,!0),state.base_;if(!state.finalized_){state.finalized_=!0,state.scope_.unfinalizedDrafts_--;const result=state.copy_;let resultEach=result,isSet2=!1;3===state.type_&&(resultEach=new Set(result),result.clear(),isSet2=!0),each(resultEach,((key,childValue)=>finalizeProperty(rootScope,state,result,key,childValue,path,isSet2))),maybeFreeze(rootScope,result,!1),path&&rootScope.patches_&&getPlugin("Patches").generatePatches_(state,path,rootScope.patches_,rootScope.inversePatches_)}return state.copy_}function finalizeProperty(rootScope,parentState,targetObject,prop,childValue,rootPath,targetIsSet){if(isDraft(childValue)){const res=finalize(rootScope,childValue,rootPath&&parentState&&3!==parentState.type_&&!has(parentState.assigned_,prop)?rootPath.concat(prop):void 0);if(set(targetObject,prop,res),!isDraft(res))return;rootScope.canAutoFreeze_=!1}else targetIsSet&&targetObject.add(childValue);if(isDraftable(childValue)&&!isFrozen(childValue)){if(!rootScope.immer_.autoFreeze_&&rootScope.unfinalizedDrafts_<1)return;finalize(rootScope,childValue),parentState&&parentState.scope_.parent_||maybeFreeze(rootScope,childValue)}}function maybeFreeze(scope,value,deep=!1){!scope.parent_&&scope.immer_.autoFreeze_&&scope.canAutoFreeze_&&freeze(value,deep)}var objectTraps={get(state,prop){if(prop===DRAFT_STATE)return state;const source=latest(state);if(!has(source,prop))return function readPropFromProto(state,source,prop){const desc=getDescriptorFromProto(source,prop);return desc?"value"in desc?desc.value:desc.get?.call(state.draft_):void 0}(state,source,prop);const value=source[prop];return state.finalized_||!isDraftable(value)?value:value===peek(state.base_,prop)?(prepareCopy(state),state.copy_[prop]=createProxy(value,state)):value},has:(state,prop)=>prop in latest(state),ownKeys:state=>Reflect.ownKeys(latest(state)),set(state,prop,value){const desc=getDescriptorFromProto(latest(state),prop);if(desc?.set)return desc.set.call(state.draft_,value),!0;if(!state.modified_){const current2=peek(latest(state),prop),currentState=current2?.[DRAFT_STATE];if(currentState&&currentState.base_===value)return state.copy_[prop]=value,state.assigned_[prop]=!1,!0;if(function is(x,y){return x===y?0!==x||1/x==1/y:x!=x&&y!=y}(value,current2)&&(void 0!==value||has(state.base_,prop)))return!0;prepareCopy(state),markChanged(state)}return state.copy_[prop]===value&&(void 0!==value||prop in state.copy_)||Number.isNaN(value)&&Number.isNaN(state.copy_[prop])||(state.copy_[prop]=value,state.assigned_[prop]=!0),!0},deleteProperty:(state,prop)=>(void 0!==peek(state.base_,prop)||prop in state.base_?(state.assigned_[prop]=!1,prepareCopy(state),markChanged(state)):delete state.assigned_[prop],state.copy_&&delete state.copy_[prop],!0),getOwnPropertyDescriptor(state,prop){const owner=latest(state),desc=Reflect.getOwnPropertyDescriptor(owner,prop);return desc?{writable:!0,configurable:1!==state.type_||"length"!==prop,enumerable:desc.enumerable,value:owner[prop]}:desc},defineProperty(){die(11)},getPrototypeOf:state=>getPrototypeOf(state.base_),setPrototypeOf(){die(12)}},arrayTraps={};function peek(draft,prop){const state=draft[DRAFT_STATE];return(state?latest(state):draft)[prop]}function getDescriptorFromProto(source,prop){if(!(prop in source))return;let proto=getPrototypeOf(source);for(;proto;){const desc=Object.getOwnPropertyDescriptor(proto,prop);if(desc)return desc;proto=getPrototypeOf(proto)}}function markChanged(state){state.modified_||(state.modified_=!0,state.parent_&&markChanged(state.parent_))}function prepareCopy(state){state.copy_||(state.copy_=shallowCopy(state.base_,state.scope_.immer_.useStrictShallowCopy_))}each(objectTraps,((key,fn)=>{arrayTraps[key]=function(){return arguments[0]=arguments[0][0],fn.apply(this,arguments)}})),arrayTraps.deleteProperty=function(state,prop){return arrayTraps.set.call(this,state,prop,void 0)},arrayTraps.set=function(state,prop,value){return objectTraps.set.call(this,state[0],prop,value,state[0])};function createProxy(value,parent){const draft=isMap(value)?getPlugin("MapSet").proxyMap_(value,parent):isSet(value)?getPlugin("MapSet").proxySet_(value,parent):function createProxyProxy(base,parent){const isArray=Array.isArray(base),state={type_:isArray?1:0,scope_:parent?parent.scope_:getCurrentScope(),modified_:!1,finalized_:!1,assigned_:{},parent_:parent,base_:base,draft_:null,copy_:null,revoke_:null,isManual_:!1};let target=state,traps=objectTraps;isArray&&(target=[state],traps=arrayTraps);const{revoke,proxy}=Proxy.revocable(target,traps);return state.draft_=proxy,state.revoke_=revoke,proxy}(value,parent);return(parent?parent.scope_:getCurrentScope()).drafts_.push(draft),draft}function currentImpl(value){if(!isDraftable(value)||isFrozen(value))return value;const state=value[DRAFT_STATE];let copy;if(state){if(!state.modified_)return state.base_;state.finalized_=!0,copy=shallowCopy(value,state.scope_.immer_.useStrictShallowCopy_)}else copy=shallowCopy(value,!0);return each(copy,((key,childValue)=>{set(copy,key,currentImpl(childValue))})),state&&(state.finalized_=!1),copy}var immer=new class{constructor(config){this.autoFreeze_=!0,this.useStrictShallowCopy_=!1,this.produce=(base,recipe,patchListener)=>{if("function"==typeof base&&"function"!=typeof recipe){const defaultBase=recipe;recipe=base;const self=this;return function curriedProduce(base2=defaultBase,...args){return self.produce(base2,(draft=>recipe.call(this,draft,...args)))}}let result;if("function"!=typeof recipe&&die(6),void 0!==patchListener&&"function"!=typeof patchListener&&die(7),isDraftable(base)){const scope=enterScope(this),proxy=createProxy(base,void 0);let hasError=!0;try{result=recipe(proxy),hasError=!1}finally{hasError?revokeScope(scope):leaveScope(scope)}return usePatchesInScope(scope,patchListener),processResult(result,scope)}if(!base||"object"!=typeof base){if(result=recipe(base),void 0===result&&(result=base),result===NOTHING&&(result=void 0),this.autoFreeze_&&freeze(result,!0),patchListener){const p=[],ip=[];getPlugin("Patches").generateReplacementPatches_(base,result,p,ip),patchListener(p,ip)}return result}die(1)},this.produceWithPatches=(base,recipe)=>{if("function"==typeof base)return(state,...args)=>this.produceWithPatches(state,(draft=>base(draft,...args)));let patches,inversePatches;return[this.produce(base,recipe,((p,ip)=>{patches=p,inversePatches=ip})),patches,inversePatches]},"boolean"==typeof config?.autoFreeze&&this.setAutoFreeze(config.autoFreeze),"boolean"==typeof config?.useStrictShallowCopy&&this.setUseStrictShallowCopy(config.useStrictShallowCopy)}createDraft(base){isDraftable(base)||die(8),isDraft(base)&&(base=function current(value){isDraft(value)||die(10);return currentImpl(value)}(base));const scope=enterScope(this),proxy=createProxy(base,void 0);return proxy[DRAFT_STATE].isManual_=!0,leaveScope(scope),proxy}finishDraft(draft,patchListener){const state=draft&&draft[DRAFT_STATE];state&&state.isManual_||die(9);const{scope_:scope}=state;return usePatchesInScope(scope,patchListener),processResult(void 0,scope)}setAutoFreeze(value){this.autoFreeze_=value}setUseStrictShallowCopy(value){this.useStrictShallowCopy_=value}applyPatches(base,patches){let i;for(i=patches.length-1;i>=0;i--){const patch=patches[i];if(0===patch.path.length&&"replace"===patch.op){base=patch.value;break}}i>-1&&(patches=patches.slice(i+1));const applyPatchesImpl=getPlugin("Patches").applyPatches_;return isDraft(base)?applyPatchesImpl(base,patches):this.produce(base,(draft=>applyPatchesImpl(draft,patches)))}},produce=immer.produce;immer.produceWithPatches.bind(immer),immer.setAutoFreeze.bind(immer),immer.setUseStrictShallowCopy.bind(immer),immer.applyPatches.bind(immer),immer.createDraft.bind(immer),immer.finishDraft.bind(immer)}}]);