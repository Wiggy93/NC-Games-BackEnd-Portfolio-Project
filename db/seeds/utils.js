
const db = require("../connection");


exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
	if (!created_at) return { ...otherProperties };
	return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
	return arr.reduce((ref, element) => {
		ref[element[key]] = element[value];
		return ref;
	}, {});
};

exports.formatComments = (comments, idLookup) => {
	return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
		const article_id = idLookup[belongs_to];
		return {
			article_id,
			author: created_by,
			...this.convertTimestampToDate(restOfComment),
		};
	});
};

exports.isValidJson = (text) => {
    try {
        JSON.parse(text);
        return true;
    } catch {
        return false;
    }
}

exports.isValidJsonObject = (text) => {
    if (typeof text !== 'string') {
        return false;
    }

    const startsWithOpeningCurlyBrace = text.indexOf('{') === 0;
    const endsWithClosingCurlyBrace = text.lastIndexOf('}') === (text.length - 1);

    if (startsWithOpeningCurlyBrace && endsWithClosingCurlyBrace) {
        //return isValidJson(text);
		try {
			JSON.parse(text);
			return true;
		} catch {
			return false;
		}
    }

    return false;
}
