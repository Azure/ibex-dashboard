function weightedMean(weightedValues) {
    
    let weight = 0;

    let totalWeight = weightedValues.reduce((sum, weightedValue) => {
        weight += weightedValue[0] * weightedValue[1];

        return sum + weightedValue[1];
    }, 0);

    return weight / totalWeight;
}

module.exports = weightedMean;