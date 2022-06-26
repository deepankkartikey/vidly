const lib = require('../lib');

describe('absolute', () => {
	it('should return positive if input is positive', () => {
		const result = lib.absolute(1);
		expect(result).toBe(1);
	});

	it('should return positive if input is negative', () => {
		const result = lib.absolute(-1);
		expect(result).toBe(1);
	});

	it('should return zero if input is zero', () => {
		const result = lib.absolute(0);
		expect(result).toBe(0);
	});
});

describe('greet', () => {
	it('should return greeting message', () => {
		const greeting = lib.greet('Deepank');
		expect(greeting).toMatch(/Deepank/);
	});
	it('should return greeting without name', () => {
		const greeting = lib.greet('');
		expect(greeting).toContain('Welcome');
	});
});

describe('getCurrencies', () => {
	it('contains valid currencies', () => {
		const res = lib.getCurrencies();
		expect(res).toEqual(expect.arrayContaining(['USD', 'AUD', 'EUR']));
	});
});
