# guidance

This package exists to provide a build + wrap step for the root [docs](../../docs/) folder so they can be referenced at runtime within the running web application.

This largely takes the form of embedded and navigable markdown docs within the root webapp and verb configuration panels, so on-demand help is available while using the app.

> Note: this package is manually versioned as needed when need content needs to be reloaded within the other packages. This is because there is no content within this package directly, which would trigger change detection on `yarn version check --interactive`.