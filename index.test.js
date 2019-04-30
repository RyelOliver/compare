const compare = require('./index');

describe('Compare characters', () => {

    describe('Errors for values that aren\'t strings', () => {
        test('Booleans', () => {
            expect(() => compare.characters.of(true).with(true)).toThrow();
        });
        test('Numbers', () => {
            expect(() => compare.characters.of(1).with(1)).toThrow();
        });
        test('Objects', () => {
            expect(() => compare.characters.of({ key: 1 }).with({ key: 1 })).toThrow();
        });
    });

    test('Two strings that are the same', () => {
        const actual = compare.characters.of('Lorem ipsum').with('Lorem ipsum');
        const expected = [{ status: compare.status.unmodified, value: 'Lorem ipsum' }];
        expect(actual).toStrictEqual(expected);
    });

    test('Two strings that are both empty', () => {
        const actual = compare.characters.of('').with('');
        const expected = [{ status: compare.status.unmodified, value: '' }];
        expect(actual).toStrictEqual(expected);
    });

    test('Two strings where the first is empty', () => {
        const actual = compare.characters.of('').with('Lorem ipsum');
        const expected = [{ status: compare.status.added, value: 'Lorem ipsum' }];
        expect(actual).toStrictEqual(expected);
    });

    test('Two strings where the last is empty', () => {
        const actual = compare.characters.of('Lorem ipsum').with('');
        const expected = [{ status: compare.status.removed, value: 'Lorem ipsum' }];
        expect(actual).toStrictEqual(expected);
    });

    test('Two strings where the last is empty', () => {
        
        const actual = compare.characters.of('Lorem ipsum').with('');
        const expected = [{ status: compare.status.removed, value: 'Lorem ipsum' }];
        expect(actual).toStrictEqual(expected);
       
    });
});