# Sample datasets
These are datasets used in the example projects and Storybook interactive tests.

## Real data
These two datasets are used in our causality tools (e.g., [ShowWhy](https://github.com/microsoft/showwhy)) to demonstrate interactive building and execution of causal models. They provide good real-world examples of useful data transforms DataShaper can perform to prepare data for analysis. Please see the "Smoking" example in the webapp to try them out. These are well-known, publicly accessible datasets, and are hosted here only to provide stability for our examples in the case of broken links. We recommend retrieving from the original source for any significant use, and have included citation information here from the respective sources.

### NHEFS
Last downloaded October 17. 2023 from https://raw.githubusercontent.com/BiomedSciAI/causallib/master/causallib/datasets/data/nhefs/NHEFS.csv

This example is used for causal inference algorithms including discovery and interactive model building, and we replicate methods discussed here: https://www.hsph.harvard.edu/miguel-hernan/causal-inference-book/.

The original source of NHEFS data is from the CDC, with the following notices:


National Center for Health Statistics. Data File Documentation,
NHANES I Epidemiological Followup Study (NHEFS), (machine readable data file and
Documentation) National Center for Health Statistics, Hyattsville, Maryland.

The published material should also include a disclaimer that credits any analyses, interpretations, or conclusions reached to the author (recipient of the data file) and not to NCHS, which is responsible only for the initial data. Consumers who wish to publish a technical description of the data should make an effort to insure that the description is not inconsistent with that published by NCHS.


Problems Using the Data

NHEFS is a rich source of data and NCHS encourages you to use the data for research and analysis. However, the dataset is large and complex and familiarity with data file manipulation and analysis is required. NCHS does not have the resources to perform analyses, check results, debug programs or do literature review for your work. Thorough review of the extensive documentation on the planning of the survey, analytic guidelines and individual datasets should resolve most questions. If you still have questions after careful review of the documentation, please contact the Data Dissemination Branch at (301) 458-4636 or refer to the web page at http://www.cdc.gov/nchs.


### California Proposition 99
Last downloaded October 17. 2023 from https://cdn.jsdelivr.net/gh/synth-inference/synthdid@master/data/california_prop99.csv

This example is used for synthetic difference-in-differences algorithms, source code copyright 2019 Stanford University, and more info on the dataset here: https://synth-inference.github.io/synthdid/reference/california_prop99.html

## Synthetic
This is completely fake sample data to provide enough variation to test out all of the supported verbs. Open the "Companies" example in the running webapp to experiment with them. Running the platform locally will also launch our Storybook integration tests, which use these files to demonstrate all available verbs.

- companies.csv - basic fake stats about a few tech companies
- companies2.csv - add a new company and a duplicate to test things like set operations
- products.csv - add a bunch of products for each company for testing joins, lookups, aggregations
- stocks.csv - a bunch of daily stock price data from NASDAQ to test aggregations and such. Stock data is downloaded from https://www.nasdaq.com/market-activity/stocks/{symbol}/historical