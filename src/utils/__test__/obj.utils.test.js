const { isOBJEmpty } = require('../obj.utils');

test('empty obj will return true', () => {
    expect(isOBJEmpty({})).toBeTruthy();
})