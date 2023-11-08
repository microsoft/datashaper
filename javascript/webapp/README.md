# DataShaper webapp

This package is a runnable webapp that provides an interface for creating and managing DataShaper packages and workflows. We also include a test app profile so you can use the code to understand how to build your own apps on top of our app-framework. All of the core data file management profiles are exported from app-framework so you can use them in your own apps for data file viewing and pipeline editing.

## Running + Dev

The webapp is based on React, and uses typical JavaScript conventions to run. When starting the JavaScript project from repo root, `yarn start` will launch the webapp on port 8080, and will also launch a set of Storybook stories that are hosted in the react package. The running DataShaper webapp is a client-only serverless app that performs all pipeline operations in the browser, and a deployed version of the latest is always hosted at [github.io](https://microsoft.github.io/datashaper/).

Edits to webapp files cause automatic refresh on localhost.

See [App.tsx](./src/App/App.tsx) for specific setup to use the app-framework in a data application. We also include a [test profile](./src/profiles/TestApp/TestAppProfile.ts) demonstrating what an active app profile looks like. Detailed documentation on the necessary components can be found in the [app-framework instructions](../app-framework/README.md).

## Using the app

User-centric instructions for the app are found in the root-level [docs folder](../../docs/).