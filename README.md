# ProxiScan

**ProxiScan** is a lightweight JavaScript library for comparing two datasets of points in 2D or 3D coordinate space. It calculates similarity scores based on proximity within a user-defined radius. This library is designed for efficient proximity-based point matching and supports both 2D and 3D coordinate systems.

## Features

- **2D and 3D Space Support**: Easily calculate matches for points in 2D or 3D space.
- **Flexible Scan Radius**: Define a radius to control proximity thresholds.
- **Efficient Point Matching**: Points are matched only once within the defined radius.
- **Similarity Scoring**: Computes a similarity score based on the proportion of matched points.

## Installation

You can install **ProxiScan** via npm (planned for the future) or directly by importing it into your project.

```bash
# npm package (coming soon)
npm install proxiscan
```

Or include the JavaScript file directly in your project:

```html
<script src="proxiscan.js"></script>
```

## Usage

### 1. Matching Points in 2D Space

To compare two datasets of 2D points within a given radius:

```javascript
const dataset1 = [
    [1, 2],
    [3, 4],
    [5, 6]
];

const dataset2 = [
    [1.1, 2.1],
    [3.5, 4.2],
    [7, 8]
];

const scanRadius = 0.5;

const result = ProxiScan.calculateSimilarity2D(dataset1, dataset2, scanRadius);

console.log(`Matched Points: ${result.matchedPoints}`);
console.log(`Total Points: ${result.totalPoints}`);
console.log(`Similarity Score: ${result.similarityScore}`);
```

### 2. Matching Points in 3D Space

For datasets in 3D space, use the 3D version of the function:

```javascript
const dataset1 = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

const dataset2 = [
    [1.1, 2.1, 3.1],
    [4.2, 5.1, 6.1],
    [10, 11, 12]
];

const scanRadius = 0.5;

const result = ProxiScan.calculateSimilarity3D(dataset1, dataset2, scanRadius);

console.log(`Matched Points: ${result.matchedPoints}`);
console.log(`Total Points: ${result.totalPoints}`);
console.log(`Similarity Score: ${result.similarityScore}`);
```

## API Reference

### `ProxiScan.calculateSimilarity2D(dataset1, dataset2, scanRadius)`

Compares two datasets of 2D coordinates, returning the number of matched points and a similarity score based on proximity.

- `dataset1`: Array of 2D coordinates (e.g., `[[x1, y1], [x2, y2], ...]`).
- `dataset2`: Array of 2D coordinates to compare against `dataset1`.
- `scanRadius`: Radius within which two points are considered a match.
- **Returns**: An object containing:
  - `matchedPoints`: Number of points in `dataset1` that matched a point in `dataset2`.
  - `totalPoints`: The total number of points (the maximum length of either dataset).
  - `similarityScore`: Ratio of matched points to the total number of points.

### `ProxiScan.calculateSimilarity3D(dataset1, dataset2, scanRadius)`

Similar to the 2D function, but for comparing datasets in 3D space.

- `dataset1`: Array of 3D coordinates (e.g., `[[x1, y1, z1], [x2, y2, z2], ...]`).
- `dataset2`: Array of 3D coordinates to compare against `dataset1`.
- `scanRadius`: Radius within which two points are considered a match.
- **Returns**: An object containing:
  - `matchedPoints`: Number of points in `dataset1` that matched a point in `dataset2`.
  - `totalPoints`: The total number of points (the maximum length of either dataset).
  - `similarityScore`: Ratio of matched points to the total number of points.

## Similarity Scoring

The similarity score is calculated using the formula:



This ensures that the score is always a value between 0 and 1, where:
- `0` means no points were matched.
- `1` means all points in the smaller dataset had a match in the larger dataset.

## Edge Cases

- If either dataset is empty, the similarity score is `0`.
- Points are only counted once, even if multiple points fall within the scan radius.
  
## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository, create a new branch, and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.