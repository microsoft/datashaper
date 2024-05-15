#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

# ignore camelCase since this matches our JSONSchema
# ruff: noqa: N815
"""Basic data models for defining data reads. Based on DataTableSchema: https://microsoft.github.io/datashaper/schema/datatable/datatable.json."""
from dataclasses import dataclass
from enum import Enum


class DataFormat(str, Enum):
    """Enum for the data format."""

    CSV = "csv"
    JSON = "json"


class DataOrientation(str, Enum):
    """Enum for the data orientation. See https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#json."""

    Records = "records"
    Columnar = "columns"
    Array = "array"
    Values = "values"


@dataclass
class ParserOptions:
    """Options that define core parsing behavior."""

    delimiter: str | None
    names: list[str] | None
    header: bool | None
    lineTerminator: str | None
    quoteChar: str | None
    escapeChar: str | None
    comment: str | None
    skipBlankLines: bool
    skipRows: int | None
    readRows: int | None

    @staticmethod
    def from_dict(data: dict):  # noqa ANN205 can't reference type before it is declared
        """Create a ParserOptions instance from a dictionary."""
        return ParserOptions(
            delimiter=data.get("delimiter", parser_options_defaults.delimiter),
            names=data.get("names", parser_options_defaults.names),
            header=data.get("header", parser_options_defaults.header),
            lineTerminator=data.get(
                "lineTerminator", parser_options_defaults.lineTerminator
            ),
            quoteChar=data.get("quoteChar", parser_options_defaults.quoteChar),
            escapeChar=data.get("escapeChar", parser_options_defaults.escapeChar),
            comment=data.get("comment", parser_options_defaults.comment),
            skipBlankLines=data.get(
                "skipBlankLines", parser_options_defaults.skipBlankLines
            ),
            skipRows=data.get("skipRows", parser_options_defaults.skipRows),
            readRows=data.get("readRows", parser_options_defaults.readRows),
        )


@dataclass
class TypeHints:
    """Options that define core type casting behavior when parsing files. Primarily oriented toward CSV since there are  no strong types in CSV."""

    dataFormat: DataFormat | None
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
            dataFormat=data.get("dataFormat", type_hints_defaults.dataFormat),
            trueValues=data.get("trueValues", type_hints_defaults.trueValues),
            falseValues=data.get("falseValues", type_hints_defaults.falseValues),
            naValues=data.get("naValues", type_hints_defaults.naValues),
            thousands=data.get("thousands", type_hints_defaults.thousands),
            decimal=data.get("decimal", type_hints_defaults.decimal),
            infinity=data.get("infinity", type_hints_defaults.infinity),
            dateFormat=data.get("dateFormat", type_hints_defaults.dateFormat),
        )


@dataclass
class DataShape:
    """Defines the shape of the data."""

    orientation: DataOrientation | None

    @staticmethod
    def from_dict(data: dict):  # noqa ANN205 can't reference type before it is declared
        """Create a DataShape instance from a dictionary."""
        return DataShape(
            orientation=data.get("orientation", DataOrientation.Values),
        )


class DataTable:
    """Definition for DataTable including where to find it and how to load/parse it."""

    _schema: dict
    path: str | list[str] | None
    format: DataFormat
    shape: DataShape
    parser: ParserOptions
    typeHints: TypeHints

    def __init__(self, schema: dict | None = None):
        self._schema = schema or {}
        self.path = self._schema.get("path")
        self.format = self._schema.get("format", DataFormat.CSV)
        self.shape = DataShape.from_dict(self._schema.get("shape", {}))
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
    skipRows=None,  # will start at 0
    readRows=None,  # will read all rows
)


# most of these are None because we want to use the pandas defaults
type_hints_defaults = TypeHints(
    dataFormat=DataFormat.CSV,
    trueValues=None,
    falseValues=None,
    naValues=None,
    thousands=None,
    decimal=".",
    infinity=None,
    dateFormat=None,
)

data_shape_defaults = DataShape(orientation=DataOrientation.Values)
