// Style helpers
export function getSentimentStyle(float){
    // negative
	if (float < 0.2) {
        return { color: 'green' };
    }
    // moderately negative
    if (float < 0.5) {
        return { color: 'yellow' };
    }
    // positive
    if (float <= 0.7) {
        return { color: 'orange' };
    }

    // neutral (exactly 0.5)
    return { color: 'red' };
}