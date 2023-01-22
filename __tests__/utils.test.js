const {
	convertTimestampToDate,
	createRef,
	formatComments,
	isValidJson,
	isValidJsonObject
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
	test("returns a new object", () => {
		const timestamp = 1557572706232;
		const input = { created_at: timestamp };
		const result = convertTimestampToDate(input);
		expect(result).not.toBe(input);
		expect(result).toBeObject();
	});
	test("converts a created_at property to a date", () => {
		const timestamp = 1557572706232;
		const input = { created_at: timestamp };
		const result = convertTimestampToDate(input);
		expect(result.created_at).toBeDate();
		expect(result.created_at).toEqual(new Date(timestamp));
	});
	test("does not mutate the input", () => {
		const timestamp = 1557572706232;
		const input = { created_at: timestamp };
		convertTimestampToDate(input);
		const control = { created_at: timestamp };
		expect(input).toEqual(control);
	});
	test("ignores includes any other key-value-pairs in returned object", () => {
		const input = { created_at: 0, key1: true, key2: 1 };
		const result = convertTimestampToDate(input);
		expect(result.key1).toBe(true);
		expect(result.key2).toBe(1);
	});
	test("returns unchanged object if no created_at property", () => {
		const input = { key: "value" };
		const result = convertTimestampToDate(input);
		const expected = { key: "value" };
		expect(result).toEqual(expected);
	});
});

describe("createRef", () => {
	test("returns an empty object, when passed an empty array", () => {
		const input = [];
		const actual = createRef(input);
		const expected = {};
		expect(actual).toEqual(expected);
	});
	test("returns a reference object when passed an array with a single items", () => {
		const input = [{ title: "title1", article_id: 1, name: "name1" }];
		let actual = createRef(input, "title", "article_id");
		let expected = { title1: 1 };
		expect(actual).toEqual(expected);
		actual = createRef(input, "name", "title");
		expected = { name1: "title1" };
		expect(actual).toEqual(expected);
	});
	test("returns a reference object when passed an array with many items", () => {
		const input = [
			{ title: "title1", article_id: 1 },
			{ title: "title2", article_id: 2 },
			{ title: "title3", article_id: 3 },
		];
		const actual = createRef(input, "title", "article_id");
		const expected = { title1: 1, title2: 2, title3: 3 };
		expect(actual).toEqual(expected);
	});
	test("does not mutate the input", () => {
		const input = [{ title: "title1", article_id: 1 }];
		const control = [{ title: "title1", article_id: 1 }];
		createRef(input);
		expect(input).toEqual(control);
	});
});

describe("formatComments", () => {
	test("returns an empty array, if passed an empty array", () => {
		const comments = [];
		expect(formatComments(comments, {})).toEqual([]);
		expect(formatComments(comments, {})).not.toBe(comments);
	});
	test("converts created_by key to author", () => {
		const comments = [{ created_by: "ant" }, { created_by: "bee" }];
		const formattedComments = formatComments(comments, {});
		expect(formattedComments[0].author).toEqual("ant");
		expect(formattedComments[0].created_by).toBe(undefined);
		expect(formattedComments[1].author).toEqual("bee");
		expect(formattedComments[1].created_by).toBe(undefined);
	});
	test("replaces belongs_to value with appropriate id when passed a reference object", () => {
		const comments = [{ belongs_to: "title1" }, { belongs_to: "title2" }];
		const ref = { title1: 1, title2: 2 };
		const formattedComments = formatComments(comments, ref);
		expect(formattedComments[0].article_id).toBe(1);
		expect(formattedComments[1].article_id).toBe(2);
	});
	test("converts created_at timestamp to a date", () => {
		const timestamp = Date.now();
		const comments = [{ created_at: timestamp }];
		const formattedComments = formatComments(comments, {});
		expect(formattedComments[0].created_at).toEqual(new Date(timestamp));
	});
});

describe('isValidJson()', () => {
    it('should return false if the argument could not be parsed as json', () => {
        expect(isValidJson()).toBe(false);
        expect(isValidJson(undefined)).toBe(false);
        expect(isValidJson(NaN)).toBe(false);
        expect(isValidJson(new Error('error instance'))).toBe(false);
        expect(isValidJson('')).toBe(false);
        expect(isValidJson('simple string')).toBe(false);
        expect(isValidJson('.01')).toBe(false);
        expect(isValidJson([])).toBe(false);
        expect(isValidJson(['filled', 'array'])).toBe(false);
        expect(isValidJson('[\'filled\',\'array\']')).toBe(false);
        expect(isValidJson({})).toBe(false);
        expect(isValidJson({filled: 'object'})).toBe(false);
        expect(isValidJson('{\'filled\':\'object\'}')).toBe(false);
        expect(isValidJson('{"filled":"object",}')).toBe(false);
    });

    it('should return true if the argument could be parsed as json', () => {
        expect(isValidJson(null)).toBe(true);
        expect(isValidJson('null')).toBe(true);
        expect(isValidJson(true)).toBe(true);
        expect(isValidJson('true')).toBe(true);
        expect(isValidJson(false)).toBe(true);
        expect(isValidJson('false')).toBe(true);
        expect(isValidJson(10)).toBe(true);
        expect(isValidJson('10')).toBe(true);
        expect(isValidJson(-10)).toBe(true);
        expect(isValidJson('-10')).toBe(true);
        expect(isValidJson(10.01)).toBe(true);
        expect(isValidJson('10.01')).toBe(true);
        expect(isValidJson(-10.01)).toBe(true);
        expect(isValidJson('-10.01')).toBe(true);
        expect(isValidJson(0.01)).toBe(true);
        expect(isValidJson('0.01')).toBe(true);
        expect(isValidJson(-0.01)).toBe(true);
        expect(isValidJson('-0.01')).toBe(true);
        expect(isValidJson(.01)).toBe(true);
        expect(isValidJson(0)).toBe(true);
        expect(isValidJson('0')).toBe(true);
        expect(isValidJson('{}')).toBe(true);
        expect(isValidJson('{"filled":"object"}')).toBe(true);
        expect(isValidJson('{"filled":"object","with":"two keys"}')).toBe(true);
        expect(isValidJson("{\"filled\":\"object\"}")).toBe(true);
        expect(isValidJson('[]')).toBe(true);
        expect(isValidJson('["filled","array"]')).toBe(true);
        expect(isValidJson("[\"filled\",\"array\"]")).toBe(true);
    });
});

describe('isValidJsonObject()', () => {
    it('should return false if the argument could not be parsed as a valid json object', () => {
        expect(isValidJsonObject()).toBe(false);
        expect(isValidJsonObject(undefined)).toBe(false);
        expect(isValidJsonObject(NaN)).toBe(false);
        expect(isValidJsonObject(new Error('error instance'))).toBe(false);
        expect(isValidJsonObject('')).toBe(false);
        expect(isValidJsonObject('simple string')).toBe(false);
        expect(isValidJsonObject('.01')).toBe(false);
        expect(isValidJsonObject([])).toBe(false);
        expect(isValidJsonObject(['filled', 'array'])).toBe(false);
        expect(isValidJsonObject('[\'filled\',\'array\']')).toBe(false);
        expect(isValidJsonObject({})).toBe(false);
        expect(isValidJsonObject({filled: 'object'})).toBe(false);
        expect(isValidJsonObject('{\'filled\':\'object\'}')).toBe(false);
        expect(isValidJsonObject('{"filled":"object",}')).toBe(false);
        expect(isValidJsonObject(null)).toBe(false);
        expect(isValidJsonObject('null')).toBe(false);
        expect(isValidJsonObject(true)).toBe(false);
        expect(isValidJsonObject('true')).toBe(false);
        expect(isValidJsonObject(false)).toBe(false);
        expect(isValidJsonObject('false')).toBe(false);
        expect(isValidJsonObject(10)).toBe(false);
        expect(isValidJsonObject('10')).toBe(false);
        expect(isValidJsonObject(-10)).toBe(false);
        expect(isValidJsonObject('-10')).toBe(false);
        expect(isValidJsonObject(10.01)).toBe(false);
        expect(isValidJsonObject('10.01')).toBe(false);
        expect(isValidJsonObject(-10.01)).toBe(false);
        expect(isValidJsonObject('-10.01')).toBe(false);
        expect(isValidJsonObject(0.01)).toBe(false);
        expect(isValidJsonObject('0.01')).toBe(false);
        expect(isValidJsonObject(-0.01)).toBe(false);
        expect(isValidJsonObject('-0.01')).toBe(false);
        expect(isValidJsonObject(.01)).toBe(false);
        expect(isValidJsonObject(0)).toBe(false);
        expect(isValidJsonObject('0')).toBe(false);
        expect(isValidJsonObject('[]')).toBe(false);
        expect(isValidJsonObject('["filled","array"]')).toBe(false);
        expect(isValidJsonObject("[\"filled\",\"array\"]")).toBe(false);
    });

    it('should return true if the argument could be parsed as a valid json object', () => {
        expect(isValidJsonObject('{}')).toBe(true);
        expect(isValidJsonObject('{"filled":"object"}')).toBe(true);
        expect(isValidJsonObject('{"filled":"object","with":"two keys"}')).toBe(true);
        expect(isValidJsonObject("{\"filled\":\"object\"}")).toBe(true);
    });
});