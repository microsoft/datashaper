#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

# ignore camelCase since this matches our JSONSchema
# ruff: noqa: N815
"""Basic data models for defining data reads. Based on DataTableSchema: https://microsoft.github.io/datashaper/schema/datatable/datatable.json."""
from dataclasses import dataclass
from enum import Enum

import numpy as np


class DataFormat(str, Enum):
    """Enum for the data format."""

    CSV = "csv"
    JSON = "json"


@dataclass
class ParserOptions:
    """Options that define core parsing behavior."""

    delimiter: str | None
    names: list[str] | None
    header: bool | None
    lineTerminator: str | None  # noqa: N815
    quoteChar: str | None
    escapeChar: str | None
    comment: str | None
    skipBlankLines: bool | None
    skipRows: int | None
    readRows: int | None

    @staticmethod
    def from_dict(data: dict):  # noqa ANN205 can't reference type before it is declared
        """Create a ParserOptions instance from a dictionary."""
        return ParserOptions(
            delimiter=data.get("delimiter", parser_options_defaults.delimiter),
            names=data.get("names", parser_options_defaults.names),
            header=data.get("header", parser_options_defaults.header),
            lineTerminator=data.get("lineTerminator", parser_options_defaults.lineTerminator),
            quoteChar=data.get("quoteChar", parser_options_defaults.quoteChar),
            escapeChar=data.get("escapeChar", parser_options_defaults.escapeChar),
            comment=data.get("comment", parser_options_defaults.comment),
            skipBlankLines=data.get("skipBlankLines", parser_options_defaults.skipBlankLines),
            skipRows=data.get("skipRows", parser_options_defaults.skipRows),
            readRows=data.get("readRows", parser_options_defaults.readRows),
        )


@dataclass
class TypeHints:
    """Options that define core type casting behavior when parsing files. Primarily oriented toward CSV since there are  no strong types in CSV."""

    format: DataFormat | None
    trueValues: list[str] | None
    falseValues: list[str] | None
    naValues: list[str] | None
    thousands: str | None
    decimal: str | None
    infinity: list[str] | None
    dateFormat: str | None

    @staticmethod
    def from_dict(data: dict):  # noqa ANN205 can't reference type before it is declared
        """Create a TypeHints instance from a dictionary."""
        return TypeHints(
            format=data.get("format", type_hints_defaults.format),
            trueValues=data.get("trueValues", type_hints_defaults.trueValues),
            falseValues=data.get("falseValues", type_hints_defaults.falseValues),
            naValues=data.get("naValues", type_hints_defaults.naValues),
            thousands=data.get("thousands", type_hints_defaults.thousands),
            decimal=data.get("decimal", type_hints_defaults.decimal),
            infinity=data.get("infinity", type_hints_defaults.infinity),
            dateFormat=data.get("dateFormat", type_hints_defaults.dateFormat),
        )


class DataTable:
    """Definition for DataTable including where to find it and how to load/parse it."""

    _schema: dict
    path: str | list[str]
    parser: ParserOptions
    typeHints: TypeHints

    def __init__(self, schema: dict):
        self._schema = schema
        self.path = self._schema["path"]
        self.parser = ParserOptions.from_dict(self._schema.get("parser", {}))
        self.typeHints = TypeHints.from_dict(self._schema.get("typeHints", {}))
        

parser_options_defaults = ParserOptions(
    delimiter=",",
    names=None,
    header=True,
    lineTerminator="\n",
    quoteChar="""""",
    escapeChar=None,
    comment=None,
    skipBlankLines=True,
    skipRows=0,
    readRows=np.inf,
)


# most of these are None because we want to use the pandas defaults
type_hints_defaults = TypeHints(
    format="csv",
    trueValues=None,
    falseValues=None,
    naValues=None,
    thousands=None,
    decimal=".",
    infinity=None,
    dateFormat=None,
)
