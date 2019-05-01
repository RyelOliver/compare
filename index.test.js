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

describe('Compare words', () => {
    describe('Longest unmodified', () => {
        test('No words that are the same', () => {
            const actual = compare.words.longestUnmodified
                .of('Lorem ipsum').with('x');
            const expected = '';
            expect(actual).toEqual(expected);
        });

        test('The first word is the same', () => {
            const actual = compare.words.longestUnmodified
                .of('Lorem ipsum').with('Lorem xxx');
            const expected = 'Lorem ';
            expect(actual).toEqual(expected);
        });

        test('The last word is the same', () => {
            const actual = compare.words.longestUnmodified
                .of('Lorem ipsum').with('xxx ipsum');
            const expected = ' ipsum';
            expect(actual).toEqual(expected);
        });

        test('A word in the middle is the same', () => {
            const actual = compare.words.longestUnmodified
                .of('Lorem ipsum dolor').with('xxx ipsum xxx');
            const expected = ' ipsum ';
            expect(actual).toEqual(expected);
        });

        test('Multiple words in the middle are the same', () => {
            const actual = compare.words.longestUnmodified
                .of('Lorem ipsum dolor sit amet').with('ipsum sit');
            const expected = 'ipsum ';
            expect(actual).toEqual(expected);
        });
    });

    describe('Errors for values that aren\'t strings', () => {
        test('Booleans', () => {
            expect(() => compare.words.of(true).with(true)).toThrow();
        });
        test('Numbers', () => {
            expect(() => compare.words.of(1).with(1)).toThrow();
        });
        test('Objects', () => {
            expect(() => compare.words.of({ key: 1 }).with({ key: 1 })).toThrow();
        });
    });

    test('Two strings that are the same', () => {
        const actual = compare.words
            .of('Lorem ipsum').with('Lorem ipsum');
        const expected = [{ status: compare.status.unmodified, value: 'Lorem ipsum' }];
        expect(actual).toStrictEqual(expected);
    });

    test('Two strings that are both empty', () => {
        const actual = compare.words
            .of('').with('');
        const expected = [{ status: compare.status.unmodified, value: '' }];
        expect(actual).toStrictEqual(expected);
    });

    describe('With two strings where the last has additions', () => {
        test('To the whole string', () => {
            const actual = compare.words
                .of('').with('Lorem ipsum');
            const expected = [
                { status: compare.status.added, value: 'Lorem ipsum' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('At the start of the string', () => {
            const actual = compare.words
                .of('ipsum').with('Lorem ipsum');
            const expected = [
                { status: compare.status.added, value: 'Lorem ' },
                { status: compare.status.unmodified, value: 'ipsum' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('At the end of the string', () => {
            const actual = compare.words
                .of('Lorem').with('Lorem ipsum');
            const expected = [
                { status: compare.status.unmodified, value: 'Lorem' },
                { status: compare.status.added, value: ' ipsum' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('In multiple parts of the string', () => {
            const actual = compare.words
                .of('Lorem dolor amet').with('Lorem ipsum dolor sit amet');
            const expected = [
                { status: compare.status.unmodified, value: 'Lorem' },
                { status: compare.status.added, value: ' ipsum' },
                { status: compare.status.unmodified, value: ' dolor ' },
                { status: compare.status.added, value: 'sit ' },
                { status: compare.status.unmodified, value: 'amet' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('Of white space', () => {
            const actual = compare.words
                .of('Lorem ipsum dolor sit amet').with('Lorem ipsum  dolor  sit amet ');
            const expected = [
                { status: compare.status.unmodified, value: 'Lorem ipsum ' },
                { status: compare.status.added, value: ' ' },
                { status: compare.status.unmodified, value: 'dolor' },
                { status: compare.status.added, value: ' ' },
                { status: compare.status.unmodified, value: ' sit amet' },
                { status: compare.status.added, value: ' ' },
            ];
            expect(actual).toStrictEqual(expected);
        });
    });

    describe('With two strings where the last has removals', () => {
        test('To the whole string', () => {
            const actual = compare.words
                .of('Lorem ipsum').with('');
            const expected = [{ status: compare.status.removed, value: 'Lorem ipsum' }];
            expect(actual).toStrictEqual(expected);
        });

        test('At the start of the string', () => {
            const actual = compare.words
                .of('Lorem ipsum').with('ipsum');
            const expected = [
                { status: compare.status.removed, value: 'Lorem ' },
                { status: compare.status.unmodified, value: 'ipsum' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('At the end of the string', () => {
            const actual = compare.words
                .of('Lorem ipsum').with('Lorem');
            const expected = [
                { status: compare.status.unmodified, value: 'Lorem' },
                { status: compare.status.removed, value: ' ipsum' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('At the start and end of the string', () => {
            const actual = compare.words
                .of('Lorem ipsum dolor').with('ipsum');
            const expected = [
                { status: compare.status.removed, value: 'Lorem ' },
                { status: compare.status.unmodified, value: 'ipsum' },
                { status: compare.status.removed, value: ' dolor' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('In multiple parts of the string', () => {
            const actual = compare.words
                .of('Lorem ipsum dolor sit amet').with('Lorem dolor amet');
            const expected = [
                { status: compare.status.unmodified, value: 'Lorem' },
                { status: compare.status.removed, value: ' ipsum' },
                { status: compare.status.unmodified, value: ' dolor ' },
                { status: compare.status.removed, value: 'sit ' },
                { status: compare.status.unmodified, value: 'amet' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('Of white space', () => {
            const actual = compare.words
                .of('Lorem ipsum  dolor  sit amet ').with('Lorem ipsum dolor sit amet');
            const expected = [
                { status: compare.status.unmodified, value: 'Lorem ipsum ' },
                { status: compare.status.removed, value: ' ' },
                { status: compare.status.unmodified, value: 'dolor' },
                { status: compare.status.removed, value: ' ' },
                { status: compare.status.unmodified, value: ' sit amet' },
                { status: compare.status.removed, value: ' ' },
            ];
            expect(actual).toStrictEqual(expected);
        });
    });
});