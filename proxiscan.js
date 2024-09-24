/*
* Copyright (c) 2024 Vikas Dwivedi
* Licensed under the MIT license
*/

(function(global) {
    const ProxiScan = {};

    function validateDataset(dataset, dimensions) {
        if (!Array.isArray(dataset) || dataset.length === 0) {
            throw new Error("Invalid dataset: must be a non-empty array.");
        }

        dataset.forEach(point => {
            if (!Array.isArray(point) || point.length !== dimensions) {
                throw new Error(`Invalid dataset: each point must have ${dimensions} coordinates.`);
            }
        });
    }
    // Function to calculate the Euclidean distance between two points in 2D space
    function calculateDistance2D(point1, point2) {
        return Math.sqrt(Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2));
    }

    // Function to calculate the Euclidean distance between two points in 3D space
    function calculateDistance3D(point1, point2) {
        return Math.sqrt(Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2) + Math.pow(point2[2] - point1[2], 2));
    }

    // Main function to calculate similarity score for 2D or 3D space

    ProxiScan.calculateMultiDatasetSimilarity = function(masterDataset, testDatasets, scanRadius, dimensions = 2, useAndCondition = true) {
        // Validate datasets
        validateDataset(masterDataset, dimensions);
        testDatasets.forEach(testDataset => validateDataset(testDataset, dimensions));

        let matchedPoints = 0;
        let matchedPairs = []; // To store matched points with corresponding matches in all datasets

        // Choose the correct distance calculation function based on dimensions (2D or 3D)
        const calculateDistance = dimensions === 3 ? calculateDistance3D : calculateDistance2D;

        // Iterate through each point in the master dataset
        masterDataset.forEach(masterPoint => {
            let pointMatches = []; // To store matches from test datasets for the current master point
            let matchFound = useAndCondition; // AND condition requires matching all datasets, OR requires any

            // Check if the point in the master dataset matches in each test dataset
            for (let datasetIndex = 0; datasetIndex < testDatasets.length; datasetIndex++) {
                let testDataset = testDatasets[datasetIndex];
                let matchedInDataset = false;

                for (let i = 0; i < testDataset.length; i++) {
                    let testPoint = testDataset[i];
                    let distance = calculateDistance(masterPoint, testPoint);

                    if (distance <= scanRadius) {
                        pointMatches.push({ datasetIndex, testPoint });
                        matchedInDataset = true;
                        break; // Stop searching after finding the first match in the current dataset
                    }
                }

                if (useAndCondition) {
                    // If using AND condition and there's no match in one dataset, break the loop
                    if (!matchedInDataset) {
                        matchFound = false;
                        break;
                    }
                } else {
                    // If using OR condition, we just need one match
                    if (matchedInDataset) {
                        matchFound = true;
                        break;
                    }
                }
            }

            // If match criteria are met (either AND or OR), record the match
            if (matchFound) {
                matchedPoints++;
                matchedPairs.push({
                    masterPoint,
                    matches: pointMatches.map(match => ({ testDatasetIndex: match.datasetIndex, testPoint: match.testPoint }))
                });
            }
        });

        // Calculate the similarity score
        const maxPoints = masterDataset.length;
        const similarityScore = matchedPoints / maxPoints;

        return {
            matchedPoints: matchedPoints,
            totalPoints: maxPoints,
            similarityScore: similarityScore,
            matchedPairs: matchedPairs // Return the matched pairs of points across datasets
        };
    };

    global.ProxiScan = ProxiScan;
})(typeof window !== "undefined" ? window : global);
