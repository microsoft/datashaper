The structure of these files in the UX should look like:

nhefs-project

- nhefs
  - nhefs.csv
  - codebook.json
- nhefs-transformed
  - nhefs (symlink)
  - workflow.json
- explore.json

We could also represent this tree using the `title` of each JSON to print friendly names:

NHEFS Causal Analysis

- NHEFS
  - nhefs.csv
  - NHEFS Codebook
- NHEFS (prepared)
  - NHEFS (symlink)
  - NHEFS Workflow
- NHEFS Causal Discovery

The actions/UX for each are:

- nhefs - click to view materialized source table with codebook applied
  - nhefs.csv - click to view raw CSV content and parsing options
  - codebook.json - click to view codebook editor
- nhefs-transformed - click to view materialized symlink table with workflow editing
  - nhefs (symlink) - click to view symlinked table bundle
  - workflow.json - click to view worfklow graph editor
- explore.json - click to view causedis interface
