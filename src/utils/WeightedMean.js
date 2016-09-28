function weightedMean(weightedValues) {
    var totalWeight = weightedValues.reduce((sum, weightedValue) => {
        return sum + weightedValue[1];
    }, 0);

    return weightedValues.reduce((mean, weightedValue) => {
        return mean + weightedValue[0] * weightedValue[1] / totalWeight;
    }, 0);
}

module.exports = weightedMean;