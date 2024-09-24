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

    function mergeMasterDatasets(masterDatasets, scanRadius, dimensions, acceptancePercentage) {
        const mergedMasterDataset = [];
        const pointOccurrences = new Map(); // Map to track occurrences of similar points

        const calculateDistance = dimensions === 3 ? calculateDistance3D : calculateDistance2D;

        // Calculate the threshold for how many datasets a point must appear in to be accepted
        const totalDatasets = masterDatasets.length;
        const acceptanceThreshold = Math.ceil((acceptancePercentage / 100) * totalDatasets);

        // Iterate over all points in each master dataset and count occurrences of points within the scanRadius
        masterDatasets.forEach(dataset => {
            dataset.forEach(point1 => {
                let foundSimilar = false;

                for (let [existingPoint, count] of pointOccurrences) {
                    let distance = calculateDistance(existingPoint, point1);
                    if (distance <= scanRadius) {
                        pointOccurrences.set(existingPoint, count + 1); // Increment occurrence count for similar point
                        foundSimilar = true;
                        break;
                    }
                }

                if (!foundSimilar) {
                    // Add point1 as a new entry in the map with an occurrence count of 1
                    pointOccurrences.set(point1, 1);
                }
            });
        });

        // Include only those points in the final master dataset that meet the acceptance threshold
        for (let [point, count] of pointOccurrences) {
            if (count >= acceptanceThreshold) {
                mergedMasterDataset.push(point);
            }
        }

        return mergedMasterDataset;
    }

    ProxiScan.calculateMultiMasterDatasetSimilarity = function(masterDatasets, testDatasets, scanRadius, dimensions = 2, useAndCondition = true, acceptancePercentage = 100) {
        // Validate master datasets
        masterDatasets.forEach(dataset => validateDataset(dataset, dimensions));

        // Merge the master datasets based on the acceptance percentage
        const finalMasterDataset = mergeMasterDatasets(masterDatasets, scanRadius, dimensions, acceptancePercentage);

        // Validate test datasets
        testDatasets.forEach(testDataset => validateDataset(testDataset, dimensions));

        let matchedPoints = 0;
        let matchedPairs = []; // To store matched points with corresponding matches in all datasets

        // Choose the correct distance calculation function based on dimensions (2D or 3D)
        const calculateDistance = dimensions === 3 ? calculateDistance3D : calculateDistance2D;

        // Iterate through each point in the final master dataset
        finalMasterDataset.forEach(masterPoint => {
            let pointMatches = []; // To store matches from test datasets for the current master point
            let matchFound = useAndCondition; // AND condition requires matching all datasets, OR requires any

            // Check if the point in the final master dataset matches in each test dataset
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
        const maxPoints = finalMasterDataset.length;
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
