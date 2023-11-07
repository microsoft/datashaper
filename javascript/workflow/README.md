# workflow

This package contains the core execution engine and verb implementations for our client-side pipelines. Specifically, the workflow engine reads a JSON schema definition for a pipeline, instantiates a reactive processing graph using RXJS, and then applies it to incoming data tables. The [react](../react/) package contains a variety of hooks and other components to bind this core processing flow to web UX.

Arquero is used as our core client-side table processing engine; therefore our verbs are largely wrappers around Arquero verbs (sometimes with syntactic sugar or simplification).