const compare = require('./index');

describe('Compare characters', () => {

    describe('Longest unmodified', () => {
        test('No text that is the same', () => {
            const actual = compare.characters.longestUnmodified
                .of('Lorem ipsum').with('x');
            const expected = '';
            expect(actual).toEqual(expected);
        });

        test('The first part of the text is the same', () => {
            const actual = compare.characters.longestUnmodified
                .of('Lorem ipsum').with('Lorexxx');
            const expected = 'Lore';
            expect(actual).toEqual(expected);
        });

        test('The last part of the text is the same', () => {
            const actual = compare.characters.longestUnmodified
                .of('Lorem ipsum').with('xxxpsum');
            const expected = 'psum';
            expect(actual).toEqual(expected);
        });

        test('The middle part of the text is the same', () => {
            const actual = compare.characters.longestUnmodified
                .of('Lorem ipsum').with('xxxrem ipsum');
            const expected = 'rem ipsum';
            expect(actual).toEqual(expected);
        });

        test('Multiple middle parts of the text', () => {
            const actual = compare.characters.longestUnmodified
                .of('Lorem ipsum dolor sit').with('Lorex ipxum doxor xit');
            const expected = 'um do';
            expect(actual).toEqual(expected);
        });
    });

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
        const actual = compare.characters
            .of('Lorem ipsum').with('Lorem ipsum');
        const expected = [{ status: compare.status.unmodified, value: 'Lorem ipsum' }];
        expect(actual).toStrictEqual(expected);
    });

    test('Two strings that are both empty', () => {
        const actual = compare.characters
            .of('').with('');
        const expected = [{ status: compare.status.unmodified, value: '' }];
        expect(actual).toStrictEqual(expected);
    });

    describe('With two strings where the last has additions', () => {
        test('To the whole string', () => {
            const actual = compare.characters
                .of('').with('Lorem ipsum');
            const expected = [{ status: compare.status.added, value: 'Lorem ipsum' }];
            expect(actual).toStrictEqual(expected);
        });

        test('At the start of the string', () => {
            const actual = compare.characters
                .of('ipsum').with('Lorem ipsum');
            const expected = [
                { status: compare.status.added, value: 'Lorem ' },
                { status: compare.status.unmodified, value: 'ipsum' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('At the end of the string', () => {
            const actual = compare.characters
                .of('Lorem').with('Lorem ipsum');
            const expected = [
                { status: compare.status.unmodified, value: 'Lorem' },
                { status: compare.status.added, value: ' ipsum' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('At the start and end of the string', () => {
            const actual = compare.characters
                .of('ipsum').with('Lorem ipsum dolor');
            const expected = [
                { status: compare.status.added, value: 'Lorem ' },
                { status: compare.status.unmodified, value: 'ipsum' },
                { status: compare.status.added, value: ' dolor' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('In multiple parts of the string', () => {
            const actual = compare.characters
                .of('ipsum sit').with('Lorem ipsum dolor sit amet');
            const expected = [
                { status: compare.status.added, value: 'Lorem ' },
                { status: compare.status.unmodified, value: 'ipsum ' },
                { status: compare.status.added, value: 'dolor ' },
                { status: compare.status.unmodified, value: 'sit' },
                { status: compare.status.added, value: ' amet' },
            ];
            expect(actual).toStrictEqual(expected);
        });
    });

    describe('With two strings where the last has removals', () => {
        test('To the whole string', () => {
            const actual = compare.characters
                .of('Lorem ipsum').with('');
            const expected = [{ status: compare.status.removed, value: 'Lorem ipsum' }];
            expect(actual).toStrictEqual(expected);
        });

        test('At the start of the string', () => {
            const actual = compare.characters
                .of('Lorem ipsum').with('ipsum');
            const expected = [
                { status: compare.status.removed, value: 'Lorem ' },
                { status: compare.status.unmodified, value: 'ipsum' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('At the end of the string', () => {
            const actual = compare.characters
                .of('Lorem ipsum').with('Lorem');
            const expected = [
                { status: compare.status.unmodified, value: 'Lorem' },
                { status: compare.status.removed, value: ' ipsum' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('At the start and end of the string', () => {
            const actual = compare.characters
                .of('Lorem ipsum dolor').with('ipsum');
            const expected = [
                { status: compare.status.removed, value: 'Lorem ' },
                { status: compare.status.unmodified, value: 'ipsum' },
                { status: compare.status.removed, value: ' dolor' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('In multiple parts of the string', () => {
            const actual = compare.characters
                .of('Lorem ipsum dolor sit amet').with('ipsum sit');
            const expected = [
                { status: compare.status.removed, value: 'Lorem ' },
                { status: compare.status.unmodified, value: 'ipsum ' },
                { status: compare.status.removed, value: 'dolor ' },
                { status: compare.status.unmodified, value: 'sit' },
                { status: compare.status.removed, value: ' amet' },
            ];
            expect(actual).toStrictEqual(expected);
        });
    });
});