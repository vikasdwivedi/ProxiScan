(function(global) {
    // ProxiScan object to store public methods
    const ProxiScan = {};

    // Error handler for invalid datasets
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
    ProxiScan.calculateSimilarity = function(dataset1, dataset2, scanRadius, dimensions = 2) {
        // Validate inputs
        if (typeof scanRadius !== "number" || scanRadius <= 0) {
            throw new Error("Invalid scanRadius: must be a positive number.");
        }

        if (![2, 3].includes(dimensions)) {
            throw new Error("Invalid dimensions: only 2 and 3 are supported.");
        }

        // Validate datasets
        validateDataset(dataset1, dimensions);
        validateDataset(dataset2, dimensions);

        let matchedPoints = 0;
        let usedPoints = new Set();

        // Choose the correct distance calculation function based on dimensions (2 or 3)
        const calculateDistance = dimensions === 3 ? calculateDistance3D : calculateDistance2D;

        // Iterate through each point in dataset1
        dataset1.forEach(point1 => {
            for (let i = 0; i < dataset2.length; i++) {
                if (!usedPoints.has(i)) {
                    let point2 = dataset2[i];
                    let distance = calculateDistance(point1, point2);

                    // If the distance is within the scanRadius, count it as a match
                    if (distance <= scanRadius) {
                        matchedPoints++;
                        usedPoints.add(i); // Mark this point as used
                        break; // Exit loop after finding the first match for this point
                    }
                }
            }
        });

        // Calculate the similarity score
        const maxPoints = Math.max(dataset1.length, dataset2.length);
        const similarityScore = matchedPoints / maxPoints;

        return {
            matchedPoints: matchedPoints,
            totalPoints: maxPoints,
            similarityScore: similarityScore
        };
    };

    // Expose ProxiScan to the global object (but not directly in the global namespace)
    global.ProxiScan = ProxiScan;

})(typeof window !== "undefined" ? window : global);
