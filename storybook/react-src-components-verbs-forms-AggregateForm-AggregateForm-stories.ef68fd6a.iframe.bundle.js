/*! For license information please see react-src-components-verbs-forms-AggregateForm-AggregateForm-stories.ef68fd6a.iframe.bundle.js.LICENSE.txt */
"use strict";(self.webpackChunk_datashaper_stories=self.webpackChunk_datashaper_stories||[]).push([[538],{"../react/src/components/verbs/forms/AggregateForm/AggregateForm.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Primary:()=>Primary,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../../.yarn/cache/react-npm-18.2.0-1eae08fee2-88e38092da.zip/node_modules/react/jsx-runtime.js"),_datashaper_schema__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("../schema/src/workflow/verbs.ts"),_AggregateForm_base_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("../react/src/components/verbs/forms/AggregateForm/AggregateForm.base.tsx");const __WEBPACK_DEFAULT_EXPORT__={title:"Verbs/Aggregate Base",component:_AggregateForm_base_js__WEBPACK_IMPORTED_MODULE_1__.e},Primary=(args=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_AggregateForm_base_js__WEBPACK_IMPORTED_MODULE_1__.e,{...args,columns:["symbol","price","date"]})).bind({});Primary.args={step:{id:"step-1",verb:"aggregate",args:{column:"price",groupby:"symbol",operation:_datashaper_schema__WEBPACK_IMPORTED_MODULE_2__.Ei.Mean}},output:"output-table",onChange:step=>console.log("change step",step),onChangeOutput:value=>console.log("change output to ",value)},Primary.parameters={...Primary.parameters,docs:{...Primary.parameters?.docs,source:{originalSource:"(Template.bind({}) as any) as {\n  args: StepFormProps<AggregateArgs>;\n}",...Primary.parameters?.docs?.source}}}},"../react/src/components/verbs/forms/AggregateForm/AggregateForm.base.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{e:()=>AggregateFormBase});var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../../.yarn/cache/react-npm-18.2.0-1eae08fee2-88e38092da.zip/node_modules/react/jsx-runtime.js"),_datashaper_schema__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("../schema/src/workflow/verbs.ts"),react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("../../.yarn/cache/react-npm-18.2.0-1eae08fee2-88e38092da.zip/node_modules/react/index.js"),_forms_index_js__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("../react/src/components/verbs/forms/forms/factories.ts"),_forms_index_js__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("../react/src/components/verbs/forms/forms/VerbForm.tsx");const AggregateFormBase=function AggregateFormBase({step,onChange,columns}){const verbInputs=(0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)((()=>[(0,_forms_index_js__WEBPACK_IMPORTED_MODULE_2__.j6)("Column to group by",columns,step.args.groupby,((s,key)=>{s.args.groupby=key}),{required:!0,placeholder:"Choose column"}),(0,_forms_index_js__WEBPACK_IMPORTED_MODULE_2__.ih)("Function",_datashaper_schema__WEBPACK_IMPORTED_MODULE_3__.Ei,step.args.operation,((s,key)=>{s.args.operation=key}),{required:!0,placeholder:"Choose function"})]),[step,columns]);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_forms_index_js__WEBPACK_IMPORTED_MODULE_4__.g,{step,inputs:verbInputs,onChange})};try{AggregateFormBase.displayName="AggregateFormBase",AggregateFormBase.__docgenInfo={description:"Just the group/column/op inputs for an aggregation.\nInput table is expected to be edited elsewhere and configured as the step input.",displayName:"AggregateFormBase",props:{step:{defaultValue:null,description:"",name:"step",required:!0,type:{name:"Step<AggregateArgs>"}},onChange:{defaultValue:null,description:"Event handler for when the step is changed in the component",name:"onChange",required:!1,type:{name:"StepChangeFunction<AggregateArgs>"}},columns:{defaultValue:null,description:"",name:"columns",required:!0,type:{name:"string[]"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["../react/src/components/verbs/forms/AggregateForm/AggregateForm.base.tsx#AggregateFormBase"]={docgenInfo:AggregateFormBase.__docgenInfo,name:"AggregateFormBase",path:"../react/src/components/verbs/forms/AggregateForm/AggregateForm.base.tsx#AggregateFormBase"})}catch(__react_docgen_typescript_loader_error){}}}]);