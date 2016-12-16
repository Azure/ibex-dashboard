// Style helpers
export function getSentimentStyle(float){
    // negative
	if (float < 0.3) {
        return { color: 'red' };
    }
    // moderately negative
    if (float < 0.5) {
        return { color: 'orange' };
    }
    // positive
    if (float > 0.7) {
        return { color: 'royalblue' };
    }
    // moderately positive
    if (float > 0.5) {
        return { color: 'green' };
    }
    // neutral (exactly 0.5)
    return { color: 'yellow' };
}