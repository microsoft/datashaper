/*! For license information please see react-src-components-verbs-forms-EncodeDecodeForm-EncodeDecodeForm-stories.f14835ae.iframe.bundle.js.LICENSE.txt */
"use strict";(self.webpackChunk_datashaper_stories=self.webpackChunk_datashaper_stories||[]).push([[901],{"../react/src/components/verbs/forms/EncodeDecodeForm/EncodeDecodeForm.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Primary:()=>Primary,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../../.yarn/cache/react-npm-18.2.0-1eae08fee2-b9214a9bd7.zip/node_modules/react/jsx-runtime.js"),_datashaper_schema__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("../schema/src/workflow/verbs.ts"),_EncodeDecodeForm_base_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("../react/src/components/verbs/forms/EncodeDecodeForm/EncodeDecodeForm.base.tsx");const __WEBPACK_DEFAULT_EXPORT__={title:"Verbs/Encode Base",component:_EncodeDecodeForm_base_js__WEBPACK_IMPORTED_MODULE_1__.m},Primary=(args=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_EncodeDecodeForm_base_js__WEBPACK_IMPORTED_MODULE_1__.m,{...args})).bind({});Primary.args={step:{id:"step-1",verb:"encode",args:{strategy:_datashaper_schema__WEBPACK_IMPORTED_MODULE_2__.ZN.MappingOnly}},output:"output-table",onChange:step=>console.log("change step",step),onChangeOutput:value=>console.log("change output to ",value)},Primary.parameters={...Primary.parameters,docs:{...Primary.parameters?.docs,source:{originalSource:"(Template.bind({}) as any) as {\n  args: StepFormProps<EncodeDecodeArgs>;\n}",...Primary.parameters?.docs?.source}}}},"../react/src/components/verbs/forms/EncodeDecodeForm/EncodeDecodeForm.base.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{m:()=>EncodeDecodeFormBase});var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../../.yarn/cache/react-npm-18.2.0-1eae08fee2-b9214a9bd7.zip/node_modules/react/jsx-runtime.js"),_datashaper_schema__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("../schema/src/workflow/verbs.ts"),react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("../../.yarn/cache/react-npm-18.2.0-1eae08fee2-b9214a9bd7.zip/node_modules/react/index.js"),_forms_index_js__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("../react/src/components/verbs/forms/forms/factories.ts"),_forms_index_js__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("../react/src/components/verbs/forms/forms/VerbForm.tsx");const EncodeDecodeFormBase=function EncodeDecodeFormBase({step,onChange}){const verbInputs=(0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)((()=>[(0,_forms_index_js__WEBPACK_IMPORTED_MODULE_2__.ih)("Codebook strategy",_datashaper_schema__WEBPACK_IMPORTED_MODULE_3__.ZN,step.args.strategy,((s,opt)=>{s.args.strategy=opt}),{required:!0,placeholder:"Choose strategy"})]),[step]);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_forms_index_js__WEBPACK_IMPORTED_MODULE_4__.g,{step,inputs:verbInputs,onChange})};try{EncodeDecodeFormBase.displayName="EncodeDecodeFormBase",EncodeDecodeFormBase.__docgenInfo={description:"Just the group/column/op inputs for an aggregation.\nInput table is expected to be edited elsewhere and configured as the step input.",displayName:"EncodeDecodeFormBase",props:{step:{defaultValue:null,description:"",name:"step",required:!0,type:{name:"Step<EncodeDecodeArgs>"}},onChange:{defaultValue:null,description:"Event handler for when the step is changed in the component",name:"onChange",required:!1,type:{name:"StepChangeFunction<EncodeDecodeArgs>"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["../react/src/components/verbs/forms/EncodeDecodeForm/EncodeDecodeForm.base.tsx#EncodeDecodeFormBase"]={docgenInfo:EncodeDecodeFormBase.__docgenInfo,name:"EncodeDecodeFormBase",path:"../react/src/components/verbs/forms/EncodeDecodeForm/EncodeDecodeForm.base.tsx#EncodeDecodeFormBase"})}catch(__react_docgen_typescript_loader_error){}}}]);