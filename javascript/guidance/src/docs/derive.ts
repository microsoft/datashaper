// eslint-disable-next-line
export default "# derive\n\nPerforms math operations across two columns to create a new combined column.\n\n## Example\n\n| fy20 | fy21 |\n| ---- | ---- |\n| 100  | 124  |\n| 23   | 165  |\n| 354  | 300  |\n\n`derive column['fy20'] operation='add' with column['fy21'], to_column='output'`:\n\n| output |\n| ------ |\n| 224    |\n| 188    |\n| 354    |\n"
