# bin

Sorts continuous data into defined buckets. Values in the input table cell are replaced in the output with the lower bin boundary that they fall within.

Multiple binning strategies are supported:

- Auto: uses automatic bin boundary guessing to create nice default bins (uses [Arquero's default bin strategy](https://uwdata.github.io/arquero/api/op#bins))
- Fixed width: creates bins at an exact width specified
- Fixed count: divides the data range into a fixed number of bins of equal width

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
