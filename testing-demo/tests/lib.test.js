const lib = require('../lib');

test('absolute - should return positive if input is positive', () => {
	const result = lib.absolute(1);
	expect(result).toBe(1);
});

test('absolute - should return positive if input is negative', () => {
	const result = lib.absolute(-1);
	expect(result).toBe(1);
});

test('absolute - should return zero if input is zero', () => {
	const result = lib.absolute(0);
	expect(result).toBe(0);
});
