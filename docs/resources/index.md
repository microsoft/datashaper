# Data packages

The collection of data files and analytic configuration for your project is called a **data package**. This package is a collection of files that can be saved together (e.g., in a zip file) and used to entirely reproduce your analysis. Data packages are made up of a collection of Resources, each of which defines specific attributes of the data file or analysis it represents.

# Resources

All data files and analytical tools within DataShaper are considered "resources". This essentially just means that we create a file to store any parameters for the item, along with links to relevant child or dependent source content. For example, a [data table](./datatable/index.md) is a resource that contains a raw data file along with parsing instructions to properly read in the file contents.

All items in the application file tree are resources. When you have a particular resource selected, this guidance will update to display relevant help for that resource.

We have two main resource types:

- data files: these represent the core data content that becomes input to your analysis operations. In some cases manipulating data files may be the primary use case for DataShaper. In other cases you may need to load and prepare data for downstream analytics.
- analysis applications: these are the primary outputs that application developers create for working with data. They may be processing algorithms, data visualizations, etc. Individual applications built atop our framework will provide guidance content that describes their available resource types.
