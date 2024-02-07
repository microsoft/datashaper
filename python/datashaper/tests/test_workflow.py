import asyncio
import unittest
from dataclasses import dataclass

import pandas as pd
import pytest

from datashaper import (
    DEFAULT_INPUT_NAME,
    Progress,
    TableContainer,
    VerbCallbacks,
    VerbError,
    VerbInput,
    Workflow,
    WorkflowMissingInputError,
    WorkflowVerbNotFoundError,
    derive_from_rows,
    progress_iterable,
)


class TestWorkflowRun(unittest.IsolatedAsyncioTestCase):
    async def test_define_basic_workflow_does_not_crash(self):
        workflow = Workflow(
            verbs={
                "test_define_basic_workflow_does_not_crash": create_passthrough_verb(),
            },
            schema={
                "name": "test_workflow",
                "steps": [
                    {
                        "verb": "test_define_basic_workflow_does_not_crash",
                        "input": {"source": DEFAULT_INPUT_NAME},
                    },
                ],
            },
            validate=False,
        )
        workflow.add_table(DEFAULT_INPUT_NAME, pd.DataFrame({"a": [1, 2, 3]}))
        await workflow.run(context=create_fake_run_context())
        self.assertIsNotNone(workflow.export())

    async def test_define_basic_workflow_with_profiling_creates_profile(self):
        workflow = Workflow(
            memory_profile=True,
            verbs={
                "test_define_basic_workflow_does_not_crash": create_passthrough_verb(),
            },
            schema={
                "name": "test_workflow",
                "steps": [
                    {
                        "verb": "test_define_basic_workflow_does_not_crash",
                        "input": {"source": DEFAULT_INPUT_NAME},
                    },
                ],
            },
            validate=False,
        )
        workflow.add_table(DEFAULT_INPUT_NAME, pd.DataFrame({"a": [1, 2, 3]}))
        result = await workflow.run(create_fake_run_context())
        self.assertIsNotNone(result.memory_profile)
        self.assertIsNotNone(result.verb_timings)
        self.assertIsNotNone(workflow.export())

    async def test_run_basic_workflow_does_not_crash(self):
        workflow = Workflow(
            verbs={
                "test_run_basic_workflow_does_not_crash": create_passthrough_verb(),
            },
            schema={
                "name": "test_workflow",
                "steps": [
                    {
                        "verb": "test_run_basic_workflow_does_not_crash",
                        "input": {"source": DEFAULT_INPUT_NAME},
                    },
                ],
            },
            validate=False,
        )
        workflow.add_table(DEFAULT_INPUT_NAME, pd.DataFrame({"a": [1, 2, 3]}))
        await workflow.run(create_fake_run_context())
        self.assertIsNotNone(workflow.export())

    async def test_create_basic_workflow_with_test_inputs_does_not_crash(self):
        wf = Workflow(
            verbs={
                "test_create_basic_workflow_with_test_inputs_does_not_crash": create_passthrough_verb(),
            },
            schema={
                "name": "test_workflow",
                "steps": [
                    {
                        "id": "123",
                        "verb": "test_create_basic_workflow_with_test_inputs_does_not_crash",
                        "input": {"source": DEFAULT_INPUT_NAME},
                    },
                ],
            },
            validate=False,
            input_tables={DEFAULT_INPUT_NAME: pd.DataFrame({"a": [1, 2, 3]})},
        )
        self.assertSetEqual(wf.dependencies, set([DEFAULT_INPUT_NAME]))
        await wf.run()

    def test_workflow_dependencies(self):
        wf = Workflow(
            verbs={
                "test_workflow_dependencies": create_passthrough_verb(),
            },
            schema={
                "name": "test_workflow",
                "steps": [
                    {
                        "id": "123",
                        "verb": "test_workflow_dependencies",
                        "input": {
                            "source": DEFAULT_INPUT_NAME,
                            "depends_on": ["external_1", "external_2"],
                        },
                    },
                    {
                        "id": "123",
                        "verb": "test_workflow_dependencies",
                        "input": {"source": "external_3"},
                    },
                    {
                        "id": "123",
                        "verb": "test_workflow_dependencies",
                        "input": "external_4",
                    },
                ],
            },
            validate=False,
            input_tables={DEFAULT_INPUT_NAME: pd.DataFrame({"a": [1, 2, 3]})},
        )
        self.assertSetEqual(
            wf.dependencies,
            set(
                [
                    DEFAULT_INPUT_NAME,
                    "external_1",
                    "external_2",
                    "external_3",
                    "external_4",
                ]
            ),
        )
        # don't run, will throw because dependencies are explicitly missing

    async def test_basic_workflow_with_context_passing(self):
        workflow = Workflow(
            verbs={
                "test_basic_workflow_with_context_passing": create_context_consuming_verb(),
            },
            schema={
                "name": "test_workflow",
                "steps": [
                    {
                        "verb": "test_basic_workflow_with_context_passing",
                        "input": {"source": DEFAULT_INPUT_NAME},
                    },
                ],
            },
            validate=False,
        )
        workflow.add_table(DEFAULT_INPUT_NAME, pd.DataFrame({"a": [1, 2, 3]}))
        await workflow.run(create_fake_run_context())

    async def test_workflow_with(self):
        workflow = Workflow(
            verbs={
                "test_workflow_with": create_parallel_transforming_verb(),
            },
            schema={
                "name": "test_workflow",
                "steps": [
                    {
                        "verb": "test_workflow_with",
                        "input": {"source": DEFAULT_INPUT_NAME},
                    },
                ],
            },
            validate=False,
        )
        workflow.add_table(DEFAULT_INPUT_NAME, pd.DataFrame({"a": [1, 2, 3]}))
        await workflow.run(create_fake_run_context())
        result = workflow.output()
        row = result.iloc[0]
        assert row["b"] == row["a"] + 1

    async def test_workflow_with_transform_util_verb_throwing(self):
        workflow = Workflow(
            verbs={
                "test_workflow_with_transform_util_verb_throwing": create_parallel_transforming_verb_throwing(),
            },
            schema={
                "name": "test_workflow",
                "steps": [
                    {
                        "verb": "test_workflow_with_transform_util_verb_throwing",
                        "input": {"source": DEFAULT_INPUT_NAME},
                    },
                ],
            },
            validate=False,
        )
        workflow.add_table(DEFAULT_INPUT_NAME, pd.DataFrame({"a": [1, 2, 3]}))
        with pytest.raises(VerbError):
            await workflow.run(create_fake_run_context())

    async def test_workflow_with_async_verb(self):
        wf = Workflow(
            verbs={
                "test_workflow_with_async_verb": create_async_verb(),
            },
            schema={
                "name": "test_workflow",
                "steps": [
                    {
                        "verb": "test_workflow_with_async_verb",
                        "input": {"source": DEFAULT_INPUT_NAME},
                    },
                ],
            },
            validate=False,
        )
        wf.add_table(DEFAULT_INPUT_NAME, pd.DataFrame({"a": [1, 2, 3]}))
        await wf.run(create_fake_run_context())
        output = wf.output()
        assert output.equals(pd.DataFrame({"a": [1, 2, 3]}))

    async def test_workflow_first_step_with_invalid_input_crashes(self):
        workflow = Workflow(
            verbs={
                "test_workflow_first_step_with_invalid_input_crashes": create_passthrough_verb(),
            },
            schema={
                "name": "test_workflow",
                "steps": [
                    {
                        "verb": "test_workflow_first_step_with_invalid_input_crashes",
                        "input": {"source": "missing_input"},
                    },
                ],
            },
            validate=False,
        )
        input_data = pd.DataFrame({"a": [1, 2, 3]})
        workflow.add_table(DEFAULT_INPUT_NAME, input_data)

        with pytest.raises(WorkflowMissingInputError):
            await workflow.run(create_fake_run_context())

    async def test_workflow_invalid_verb_throws_error(self):
        with pytest.raises(WorkflowVerbNotFoundError):
            Workflow(
                verbs={
                    "test_workflow_invalid_verb_throws_error": create_passthrough_verb(),
                },
                schema={
                    "name": "test_workflow",
                    "steps": [
                        {
                            "id": "step_1",
                            "verb": "missing_verb",
                        },
                    ],
                },
                validate=False,
            )

    async def test_workflow_steps_with_no_input_defaults_input_correctly(self):
        workflow = Workflow(
            verbs={
                "test_workflow_steps_with_no_input_defaults_input_correctly": create_passthrough_verb(),
            },
            schema={
                "name": "test_workflow",
                "steps": [
                    {
                        "id": "test",
                        "verb": "test_workflow_steps_with_no_input_defaults_input_correctly",
                        # First step is missing the input, it should default to DEFAULT_INPUT_NAME
                    },
                ],
            },
            validate=False,
        )

        input_data = pd.DataFrame({"a": [1, 2, 3]})
        workflow.add_table(DEFAULT_INPUT_NAME, input_data)
        await workflow.run(context=create_fake_run_context())

        # Our test verb doesn't do anything, so the output should be the same as the input
        input_json = input_data.to_json(orient="records")
        output_json = workflow.output().to_json(orient="records")
        self.assertEqual(input_json, output_json)

    async def test_workflow_second_step_gets_first_steps_input(self):
        first_step_output = pd.DataFrame({"b": [1, 2, 3]})
        workflow = Workflow(
            verbs={
                "test_workflow_second_step_gets_first_steps_input": create_verb_that_returns(
                    first_step_output
                ),
                # Pass along the input to the output
                "test_workflow_second_step_gets_first_steps_input2": create_passthrough_verb(),
            },
            schema={
                "name": "test_workflow",
                "steps": [
                    {"verb": "test_workflow_second_step_gets_first_steps_input"},
                    {"verb": "test_workflow_second_step_gets_first_steps_input2"},
                ],
            },
            validate=False,
        )

        input_data = pd.DataFrame({"a": [1, 2, 3]})
        workflow.add_table(DEFAULT_INPUT_NAME, input_data)
        await workflow.run(context=create_fake_run_context())

        # Ensure the output looks like the "first_step_output"
        input_json = first_step_output.to_json(orient="records")
        output_json = workflow.output().to_json(orient="records")
        self.assertEqual(input_json, output_json)

    async def test_workflow_second_step_gets_first_steps_input_when_first_step_has_non_default_input(
        self,
    ):
        non_default_input = pd.DataFrame({"c": [1, 2, 3]})
        workflow = Workflow(
            verbs={
                # Pass along the input to the output
                "test_workflow_second_step_gets_first_steps_input_when_first_step_has_non_default_input": create_passthrough_verb(),
                # Pass along the input to the output
                "test_workflow_second_step_gets_first_steps_input_when_first_step_has_non_default_input2": create_passthrough_verb(),
            },
            schema={
                "name": "test_workflow",
                "steps": [
                    {
                        "verb": "test_workflow_second_step_gets_first_steps_input_when_first_step_has_non_default_input",
                        "input": {"source": "non_default_input"},
                    },
                    {
                        "verb": "test_workflow_second_step_gets_first_steps_input_when_first_step_has_non_default_input2"
                    },
                ],
            },
            validate=False,
        )

        workflow.add_table("non_default_input", non_default_input)
        await workflow.run(context=create_fake_run_context())

        # Ensure the output looks like the "first_step_output"
        input_json = non_default_input.to_json(orient="records")
        output_json = workflow.output().to_json(orient="records")
        self.assertEqual(input_json, output_json)

    async def test_workflow_second_step_gets_current_input_when_it_specifies_a_custom_input(
        self,
    ):
        second_verb_input = pd.DataFrame({"c": [1, 2, 3]})
        workflow = Workflow(
            verbs={
                # Pass along the input to the output
                "test_workflow_second_step_gets_current_input_when_it_specifies_a_custom_input": create_passthrough_verb(),
                # Pass along the input to the output
                "test_workflow_second_step_gets_current_input_when_it_specifies_a_custom_input2": create_passthrough_verb(),
            },
            schema={
                "name": "test_workflow",
                "steps": [
                    {
                        "id": "step_1",
                        "verb": "test_workflow_second_step_gets_current_input_when_it_specifies_a_custom_input",
                    },
                    {
                        "id": "step_2",
                        "verb": "test_workflow_second_step_gets_current_input_when_it_specifies_a_custom_input2",
                        "input": {"source": "second_verb_input"},
                    },
                ],
            },
            validate=False,
        )

        assert DEFAULT_INPUT_NAME in workflow.dependencies
        assert "second_verb_input" in workflow.dependencies

        input_data = pd.DataFrame({"a": [1, 2, 3]})

        # Provide the default input
        workflow.add_table(DEFAULT_INPUT_NAME, input_data)

        # provide the input data for the second verb
        workflow.add_table("second_verb_input", second_verb_input)

        # Run the workflow
        await workflow.run(create_fake_run_context())

        # Ensure the output looks like the "second_verb_input"
        input_json = second_verb_input.to_json(orient="records")
        output_json = workflow.output().to_json(orient="records")
        self.assertEqual(input_json, output_json)


@dataclass
class PipelineRunContext:
    a: int
    b: int


def create_fake_run_context() -> PipelineRunContext:
    return PipelineRunContext(a=1, b=2)  # type: ignore


def create_passthrough_verb():
    return lambda input: TableContainer(table=input.get_input())


def create_verb_that_returns(static_value: pd.DataFrame):
    return lambda input: TableContainer(table=static_value)  # noqa: ARG005


def create_async_verb():
    async def async_verb(input: TableContainer):
        await asyncio.sleep(0)
        return TableContainer(table=input.get_input())

    return async_verb


def create_parallel_transforming_verb():
    def transform(input: VerbInput, callbacks: VerbCallbacks):
        def transform_row(row: pd.Series):
            items = [1, 2, 3]
            progress_iterable(items, callbacks.progress)
            row["b"] = row["a"] + 1
            return row

        results = derive_from_rows(input.get_input(), transform_row, callbacks)

        return TableContainer(table=pd.DataFrame(results))

    return transform


def create_parallel_transforming_verb_throwing():
    def transform(input: VerbInput, callbacks: VerbCallbacks):
        def transform_row(_row: pd.Series):
            raise VerbError("oh no, this should be expected")

        results = derive_from_rows(input.get_input(), transform_row, callbacks)

        return TableContainer(table=pd.DataFrame(results))

    return transform


def create_context_consuming_verb():
    def context_verb(
        input: TableContainer,
        context: PipelineRunContext,
        callbacks: VerbCallbacks,
        a: int,
        b: int,
    ):
        assert context is not None
        assert a is not None
        assert b is not None
        assert callbacks is not None
        callbacks.error("test error")
        callbacks.warning("test warning")
        callbacks.log("test log")
        callbacks.progress(Progress(percent=0.5, description="test progress"))
        callbacks.progress(Progress(percent=0.7))
        return TableContainer(table=input.get_input())

    return context_verb
