import { contains } from './Utils.js';

// Fact component utils

export function getFilteredResults(facts, tag) {
    if (tag.length === 0) {
        return facts;
    }
    return facts.reduce(function (prev, curr) {
        if (contains(curr.tags, tag)) {
            prev.push({
                "id": curr.id,
                "date": curr.date,
                "language": curr.language,
                "title": curr.title,
                "tags": curr.tags
            });
        }
        return prev;
    }, []);
}