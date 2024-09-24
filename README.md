# ProxiScan

**ProxiScan** is a lightweight JavaScript library for comparing datasets of points in 2D or 3D coordinate space. It calculates similarity scores based on proximity, with support for matching across multiple test datasets. The library allows flexible configuration for matching logic, including AND/OR conditions between datasets.

## Features

- **2D and 3D Space Support**: Easily calculate matches for points in 2D or 3D space.
- **Flexible Scan Radius**: Define a radius to control proximity thresholds.
- **Multiple Datasets Support**: Match points from a master dataset across multiple test datasets.
- **AND/OR Matching Conditions**: Configure whether points must match in all test datasets (AND) or just any one (OR).
- **Efficient Point Matching**: Points are matched only once within the defined radius.
- **Similarity Scoring**: Computes a similarity score based on the proportion of matched points.
- **Matched Pairs Information**: Returns detailed information about which points matched and where the match occurred.

## Installation

You can use the **ProxiScan** library by including the script in your HTML file:

```html
<script src="./proxiscan.js"></script>
```

## Usage

### 1. Matching Points in 2D Space Across Multiple Datasets (AND/OR Condition)

To compare a **master dataset** against multiple **test datasets**, use the `calculateMultiDatasetSimilarity` function.

```javascript
const masterDataset = [
    [1, 2],
    [3, 4],
    [5, 6]
];

const testDataset1 = [
    [1.1, 2.1],
    [3.5, 4.2],
    [7, 8]
];

const testDataset2 = [
    [1.2, 2.2],
    [3.4, 4.3],
    [6, 7]
];

const scanRadius = 0.5;
const useAndCondition = false; // OR condition: match if found in any dataset

const result = ProxiScan.calculateMultiDatasetSimilarity(masterDataset, [testDataset1, testDataset2], scanRadius, 2, useAndCondition);

console.log(result);
```

### 2. Matching Points in 3D Space

For datasets in 3D space, use the 3D version of the function by passing `3` as the `dimensions` argument:

```javascript
const masterDataset3D = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

const testDataset3D_1 = [
    [1.1, 2.1, 3.1],
    [4.2, 5.1, 6.1],
    [10, 11, 12]
];

const testDataset3D_2 = [
    [1.2, 2.2, 3.2],
    [4.3, 5.2, 6.2],
    [7.1, 8.1, 9.1]
];

const scanRadius = 0.5;
const useAndCondition = true; // AND condition: match only if found in all datasets

const result3D = ProxiScan.calculateMultiDatasetSimilarity(masterDataset3D, [testDataset3D_1, testDataset3D_2], scanRadius, 3, useAndCondition);

console.log(result3D);
```

## API Reference

### `ProxiScan.calculateMultiDatasetSimilarity(masterDataset, testDatasets, scanRadius, dimensions = 2, useAndCondition = true)`

Compares a **master dataset** against one or more **test datasets**, returning the number of matched points and a similarity score based on proximity.

- **`masterDataset`**: An array of coordinates for the master dataset (e.g., `[[x1, y1], [x2, y2], ...]` for 2D or `[[x1, y1, z1], [x2, y2, z2], ...]` for 3D).
- **`testDatasets`**: An array of arrays, where each inner array represents a test dataset to be compared against the master dataset.
- **`scanRadius`**: A number specifying the radius within which two points are considered a match.
- **`dimensions`**: Either `2` for 2D points or `3` for 3D points.
- **`useAndCondition`**: Boolean flag to determine the matching condition:
  - `true`: Points from the master dataset must match in **all** test datasets (AND condition).
  - `false`: Points from the master dataset can match in **any** test dataset (OR condition).
  
#### Returns:

An object containing:
- **`matchedPoints`**: The number of points in the master dataset that had matches based on the condition (AND/OR).
- **`totalPoints`**: The total number of points in the master dataset.
- **`similarityScore`**: The ratio of matched points to the total points in the master dataset.
- **`matchedPairs`**: An array of matched pairs, where each entry contains:
  - **`masterPoint`**: The point from the master dataset.
  - **`matches`**: An array of objects representing the test datasets where the match occurred, including:
    - **`testDatasetIndex`**: The index of the test dataset where the match was found.
    - **`testPoint`**: The matched point from the test dataset.

#### Example Response:

```json
{
  "matchedPoints": 2,
  "totalPoints": 3,
  "similarityScore": 0.6666666666666666,
  "matchedPairs": [
    {
      "masterPoint": [1, 2],
      "matches": [
        { "testDatasetIndex": 0, "testPoint": [1.1, 2.1] },
        { "testDatasetIndex": 1, "testPoint": [1.2, 2.2] }
      ]
    },
    {
      "masterPoint": [3, 4],
      "matches": [
        { "testDatasetIndex": 0, "testPoint": [3.5, 4.2] },
        { "testDatasetIndex": 1, "testPoint": [3.4, 4.3] }
      ]
    }
  ]
}
```

### OR Condition Example:

With `useAndCondition = false`, the points in the master dataset are considered a match if they match **any** of the test datasets.

```json
{
  "matchedPoints": 3,
  "totalPoints": 3,
  "similarityScore": 1,
  "matchedPairs": [
    {
      "masterPoint": [1, 2],
      "matches": [
        { "testDatasetIndex": 0, "testPoint": [1.1, 2.1] }
      ]
    },
    {
      "masterPoint": [3, 4],
      "matches": [
        { "testDatasetIndex": 0, "testPoint": [3.5, 4.2] }
      ]
    },
    {
      "masterPoint": [5, 6],
      "matches": [
        { "testDatasetIndex": 1, "testPoint": [6, 7] }
      ]
    }
  ]
}
```

## Edge Cases

- **Empty Dataset**: If the master dataset or any of the test datasets is empty, no matches will be found, and the similarity score will be `0`.
- **Dimensions Mismatch**: If the datasets have different numbers of coordinates (e.g., a 3D point in a 2D dataset), the library will throw an error.
- **Radius**: Ensure the scan radius is a positive number; otherwise, the function will return no matches.

## Example HTML Test Page

You can create an interactive test page to try out the ProxiScan library directly in the browser. Here's a basic example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ProxiScan Test Page</title>
    <script src="./proxiscan.js"></script>
</head>
<body>
    <h1>ProxiScan Test Page</h1>
    <p>Open the browser console to see results.</p>
</body>
</html>
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
