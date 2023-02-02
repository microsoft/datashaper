# bin

Sorts continuous data into defined buckets. Values in the input table cell are replaced in the output with the lower bin boundary that they fall within.

_The input column for a binning operation must be a numeric data type._

Multiple binning strategies are supported. Please see the [numpy documentation](https://numpy.org/doc/stable/reference/generated/numpy.histogram_bin_edges.html) for detailed descriptions of the algorithms.

- Auto: uses automatic bin boundary guessing to create optimal default bins.
- Fd: Freedman diaconis estimator, resilient to outliers.
- Doane: Better for non-normal datasets.
- Scott: Less robust but takes data variability into account.
- Stone: Based on leave-one-out cross-validation.
- Rice: Only accounts for size, not variability.
- Sturges: Optimal for normally-distributed data.
- Sqrt: Square root of data size, fast and simple.
- Fixed width: creates bins at an exact width specified.
- Fixed count: divides the data range into a fixed number of bins of equal width.

Optional parameters:

- Print bin range: this converts the output to a string representation of the range.
- Minimum boundary
- Maximum boundary
- Clamping

Note: The numpy documentation contains errors, please check the code instead.

You may supply a fixed min/max to set the outer bin boundaries. By default, if data values fall outside these boundaries they are set to +/- Infinity. If clamping is enabled, values outside the boundary are assigned to the first and last bins as appropriate (i.e., values over the max fall into the last bin). Establishing min/max bounds and clamping allows data values to be binned without revealing the true extent of the data, or whether any individual rows exceed those bounds.

## Examples

| val |
| --- |
| 8   |
| 10  |
| 17  |
| 21  |
| 31  |

`bin column['val'] with bins=[0, 10, 20, 30]`:

| val |
| --- |
| 0   |
| 10  |
| 10  |
| 20  |
| 30  |

`bin column['val'] with bins=[0, 10, 20, 30], max=20`:

| val      |
| -------- |
| 0        |
| 10       |
| 10       |
| 20       |
| Infinity |

`bin column['val'] with bins=[0, 10, 20, 30], max=30, clamping=true` masks the boundary overrun:

| val |
| --- |
| 0   |
| 10  |
| 10  |
| 20  |
| 20  |
