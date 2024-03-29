<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@datashaper/react](./react.md) &gt; [FieldWellItem](./react.fieldwellitem.md)

## FieldWellItem interface

Defines an available field well. This includes UX properties for how to visually represent it (title, icon, etc). This implementation is rendered with a dropdown, and is in many ways just a fancy stylized dropdown.

<b>Signature:</b>

```typescript
export interface FieldWellItem 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [disabled?](./react.fieldwellitem.disabled.md) |  | boolean | <i>(Optional)</i> Indicate if the well is disabled - this will render the well as disabled. |
|  [icon?](./react.fieldwellitem.icon.md) |  | string | <i>(Optional)</i> Name of an icon to render in front of the well dropdown. |
|  [key](./react.fieldwellitem.key.md) |  | string | Unique key for the well. |
|  [onChange?](./react.fieldwellitem.onchange.md) |  | (key: string) =&gt; void | <i>(Optional)</i> Change handler for the dropdown, presenting the new selected key. |
|  [onReset?](./react.fieldwellitem.onreset.md) |  | () =&gt; void | <i>(Optional)</i> Handler to indicate that a field well has been reset to its default state (no binding). |
|  [options?](./react.fieldwellitem.options.md) |  | ISelectableOption\[\] | <i>(Optional)</i> List of valid options that this field well can be set to. |
|  [placeholder?](./react.fieldwellitem.placeholder.md) |  | string | <i>(Optional)</i> Placeholder for the dropdown when no value is selected. |
|  [required?](./react.fieldwellitem.required.md) |  | boolean | <i>(Optional)</i> Indicate if the well is required - this will render a red asterisk next to the title. |
|  [selectedKey?](./react.fieldwellitem.selectedkey.md) |  | string | <i>(Optional)</i> Selected key for the dropdown. |
|  [title](./react.fieldwellitem.title.md) |  | string | Title to display above the well. |

