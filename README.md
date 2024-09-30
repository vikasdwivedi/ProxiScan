# ProxiScan

**ProxiScan** is a powerful JavaScript library designed to handle proximity-based dataset matching in 2D and 3D space. The library allows you to compare multiple master datasets and test datasets based on spatial proximity, supporting both AND/OR conditions for flexible matching criteria. It also supports merging multiple master datasets based on an acceptance percentage to generate a final master dataset.

## Features

🌟 **Key Features**:
- **2D & 3D Support**: Seamlessly handle proximity-based dataset comparisons in either 2D or 3D space.
- **Multiple Master Datasets**: Merge multiple master datasets into one final master dataset using proximity-based matching and acceptance percentage.'
- **Multiple Test Datasets Support**: Match points from a master dataset across multiple test datasets.
- **Acceptance Percentage**: Specify how many datasets a point must appear in (as a percentage) to be included in the final master dataset.
- **Flexible Matching Conditions**: Choose between **AND** condition (points must match in all test datasets) or **OR** condition (points must match in any test dataset).
- **Scan Radius**: Define a custom proximity radius to control how close points must be to qualify as a match.
- **Similarity Scoring**: Computes a similarity score based on the proportion of matched points.
- **Detailed Results**: Return not just the similarity score, but also detailed information on matched pairs, including which datasets the points matched in.

## Demo
 
 Check out the demo [here](https://vikasdwivedi.github.io/proxiscan/).

## Installation

You can include the **ProxiScan** library in your project by downloading it or installing it via npm (if published):

### Using npm:
```bash
npm install proxiscan
```

### Using a script tag:
```html
<script src="./proxiscan.js"></script>
```

## Usage

### 1. Matching Points in 2D Space Across Multiple Datasets (AND/OR Condition)

To compare multiple **master datasets** against multiple **test datasets**, use the `calculateMultiMasterDatasetSimilarity` function.

```javascript
const masterDataset1 = [
    [1, 2],
    [3, 4],
    [5, 6]
];

const masterDataset2 = [
    [1.1, 2.1],
    [3, 4],
    [5, 6]
];

const masterDataset3 = [
    [1, 2],
    [3.2, 4.2],
    [7, 8]
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
const acceptancePercentage = 75; // Points must be present in 75% of the master datasets
const useAndCondition = true; // AND condition: points must match in all test datasets

const result = ProxiScan.calculateMultiMasterDatasetSimilarity(
    [masterDataset1, masterDataset2, masterDataset3],
    [testDataset1, testDataset2],
    scanRadius,
    2, // 2D points
    useAndCondition,
    acceptancePercentage
);

console.log(result);
```

### 2. Matching Points in 3D Space

For datasets in 3D space, use the 3D version of the function by passing `3` as the `dimensions` argument:

```javascript
const masterDataset3D_1 = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

const masterDataset3D_2 = [
    [1.1, 2.1, 3.1],
    [4.2, 5.1, 6.1],
    [7, 8, 9]
];

const testDataset3D = [
    [1.2, 2.2, 3.2],
    [4.3, 5.3, 6.3],
    [10, 11, 12]
];

const scanRadius = 0.5;
const acceptancePercentage = 100; // 100% acceptance for merging master datasets
const useAndCondition = false; // OR condition: points match in any test dataset

const result3D = ProxiScan.calculateMultiMasterDatasetSimilarity(
    [masterDataset3D_1, masterDataset3D_2],
    [testDataset3D],
    scanRadius,
    3, // 3D points
    useAndCondition,
    acceptancePercentage
);

console.log(result3D);
```

## API Reference

### `ProxiScan.calculateMultiMasterDatasetSimilarity(masterDatasets, testDatasets, scanRadius, dimensions = 2, useAndCondition = true, acceptancePercentage = 100)`

Compares **multiple master datasets** against one or more **test datasets**, returning the number of matched points and a similarity score based on proximity.

#### Parameters:
- **`masterDatasets`**: An array of arrays, where each inner array represents a master dataset to be merged into a final master dataset.
- **`testDatasets`**: An array of arrays, where each inner array represents a test dataset to be compared against the final master dataset.
- **`scanRadius`**: A number specifying the radius within which two points are considered a match.
- **`dimensions`**: Either `2` for 2D points or `3` for 3D points.
- **`useAndCondition`**: Boolean flag to determine the matching condition:
  - `true`: Points from the master dataset must match in **all** test datasets (AND condition).
  - `false`: Points from the master dataset can match in **any** test dataset (OR condition).
- **`acceptancePercentage`**: A percentage value that determines how many master datasets a point must appear in to be accepted into the final master dataset.

#### Returns:
An object containing:
- **`matchedPoints`**: The number of points in the final master dataset that had matches based on the specified condition (AND/OR).
- **`totalPoints`**: The total number of points in the final master dataset.
- **`similarityScore`**: The ratio of matched points to the total points in the final master dataset.
- **`matchedPairs`**: An array of matched pairs, where each entry contains:
  - **`masterPoint`**: The point from the final master dataset.
  - **`matches`**: An array of objects representing the test datasets where the match occurred, including:
    - **`testDatasetIndex`**: The index of the test dataset where the match was found.
    - **`testPoint`**: The matched point from the test dataset.

#### Example Response:

```json
{
  "matchedPoints": 2,
  "totalPoints": 2,
  "similarityScore": 1,
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
- **Acceptance Percentage**: Ensure the acceptance percentage is a valid number between `1` and `100`. Points must be present in at least that percentage of the master datasets to be included in the final master dataset.

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
