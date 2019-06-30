const Difference = require('./index');
const { By, Type } = Difference;

describe('Difference by characters', () => {
    describe('Longest unmodified', () => {
        test('No text that is the same', () => {
            const actual = Difference.longestUnmodified({ by: By.character, between: 'Lorem ipsum', and: 'x' });
            const expected = '';
            expect(actual).toEqual(expected);
        });

        test('The first part of the text is the same', () => {
            const actual = Difference.longestUnmodified({ by: By.character, between: 'Lorem ipsum', and: 'Lorexxx' });
            const expected = 'Lore';
            expect(actual).toEqual(expected);
        });

        test('The last part of the text is the same', () => {
            const actual = Difference.longestUnmodified({ by: By.character, between: 'Lorem ipsum', and: 'xxxpsum' });
            const expected = 'psum';
            expect(actual).toEqual(expected);
        });

        test('The middle part of the text is the same', () => {
            const actual = Difference.longestUnmodified({ by: By.character, between: 'Lorem ipsum', and: 'xxxrem ipsum' });
            const expected = 'rem ipsum';
            expect(actual).toEqual(expected);
        });

        test('Multiple middle parts of the text', () => {
            const actual = Difference.longestUnmodified({ by: By.character, between: 'Lorem ipsum dolor sit', and: 'Lorex ipxum doxor xit' });
            const expected = 'um do';
            expect(actual).toEqual(expected);
        });
    });

    describe('Errors for values that aren\'t strings', () => {
        test('Booleans', () => {
            expect(() => Difference.get({ by: By.character, between: true, and: true })).toThrow();
        });
        test('Numbers', () => {
            expect(() => Difference.get({ by: By.character, between: 1, and: 1 })).toThrow();
        });
        test('Objects', () => {
            expect(() => Difference.get({ by: By.character, between: { key: 1 }, and: { key: 1 } })).toThrow();
        });
    });

    test('Two strings that are the same', () => {
        const actual = Difference.get({ by: By.character, between: 'Lorem ipsum', and: 'Lorem ipsum' });
        const expected = [{ type: Type.unmodified, text: 'Lorem ipsum' }];
        expect(actual).toStrictEqual(expected);
    });

    test('Two strings that are both empty', () => {
        const actual = Difference.get({ by: By.character, between: '', and: '' });
        const expected = [{ type: Type.unmodified, text: '' }];
        expect(actual).toStrictEqual(expected);
    });

    describe('With two strings where the last has inserts', () => {
        test('To the whole string', () => {
            const actual = Difference.get({ by: By.character, between: '', and: 'Lorem ipsum' });
            const expected = [{ type: Type.insert, text: 'Lorem ipsum' }];
            expect(actual).toStrictEqual(expected);
        });

        test('At the start of the string', () => {
            const actual = Difference.get({ by: By.character, between: 'ipsum', and: 'Lorem ipsum' });
            const expected = [
                { type: Type.insert, text: 'Lorem ' },
                { type: Type.unmodified, text: 'ipsum' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('At the end of the string', () => {
            const actual = Difference.get({ by: By.character, between: 'Lorem', and: 'Lorem ipsum' });
            const expected = [
                { type: Type.unmodified, text: 'Lorem' },
                { type: Type.insert, text: ' ipsum' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('At the start and end of the string', () => {
            const actual = Difference.get({ by: By.character, between: 'ipsum', and: 'Lorem ipsum dolor' });
            const expected = [
                { type: Type.insert, text: 'Lorem ' },
                { type: Type.unmodified, text: 'ipsum' },
                { type: Type.insert, text: ' dolor' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('In multiple parts of the string', () => {
            const actual = Difference.get({ by: By.character, between: 'ipsum sit', and: 'Lorem ipsum dolor sit amet' });
            const expected = [
                { type: Type.insert, text: 'Lorem ' },
                { type: Type.unmodified, text: 'ipsum ' },
                { type: Type.insert, text: 'dolor ' },
                { type: Type.unmodified, text: 'sit' },
                { type: Type.insert, text: ' amet' },
            ];
            expect(actual).toStrictEqual(expected);
        });
    });

    describe('With two strings where the last has deletes', () => {
        test('To the whole string', () => {
            const actual = Difference.get({ by: By.character, between: 'Lorem ipsum', and: '' });
            const expected = [{ type: Type.delete, text: 'Lorem ipsum' }];
            expect(actual).toStrictEqual(expected);
        });

        test('At the start of the string', () => {
            const actual = Difference.get({ by: By.character, between: 'Lorem ipsum', and: 'ipsum' });
            const expected = [
                { type: Type.delete, text: 'Lorem ' },
                { type: Type.unmodified, text: 'ipsum' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('At the end of the string', () => {
            const actual = Difference.get({ by: By.character, between: 'Lorem ipsum', and: 'Lorem' });
            const expected = [
                { type: Type.unmodified, text: 'Lorem' },
                { type: Type.delete, text: ' ipsum' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('At the start and end of the string', () => {
            const actual = Difference.get({ by: By.character, between: 'Lorem ipsum dolor', and: 'ipsum' });
            const expected = [
                { type: Type.delete, text: 'Lorem ' },
                { type: Type.unmodified, text: 'ipsum' },
                { type: Type.delete, text: ' dolor' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('In multiple parts of the string', () => {
            const actual = Difference.get({ by: By.character, between: 'Lorem ipsum dolor sit amet', and: 'ipsum sit' });
            const expected = [
                { type: Type.delete, text: 'Lorem ' },
                { type: Type.unmodified, text: 'ipsum ' },
                { type: Type.delete, text: 'dolor ' },
                { type: Type.unmodified, text: 'sit' },
                { type: Type.delete, text: ' amet' },
            ];
            expect(actual).toStrictEqual(expected);
        });
    });
});

describe('Difference by words', () => {
    describe('Longest unmodified', () => {
        test('No words that are the same', () => {
            const actual = Difference.longestUnmodified({ by: By.word, between: 'Lorem ipsum', and: 'x' });
            const expected = '';
            expect(actual).toEqual(expected);
        });

        test('The first word is the same', () => {
            const actual = Difference.longestUnmodified({ by: By.word, between: 'Lorem ipsum', and: 'Lorem xxx' });
            const expected = 'Lorem ';
            expect(actual).toEqual(expected);
        });

        test('The last word is the same', () => {
            const actual = Difference.longestUnmodified({ by: By.word, between: 'Lorem ipsum', and: 'xxx ipsum' });
            const expected = ' ipsum';
            expect(actual).toEqual(expected);
        });

        test('A word in the middle is the same', () => {
            const actual = Difference.longestUnmodified({ by: By.word, between: 'Lorem ipsum dolor', and: 'xxx ipsum xxx' });
            const expected = ' ipsum ';
            expect(actual).toEqual(expected);
        });

        test('Multiple words in the middle are the same', () => {
            const actual = Difference.longestUnmodified({ by: By.word, between: 'Lorem ipsum dolor sit amet', and: 'ipsum sit' });
            const expected = 'ipsum ';
            expect(actual).toEqual(expected);
        });
    });

    describe('Errors for values that aren\'t strings', () => {
        test('Booleans', () => {
            expect(() => Difference.get({ by: By.word, between: true, and: true })).toThrow();
        });
        test('Numbers', () => {
            expect(() => Difference.get({ by: By.word, between: 1, and: 1 })).toThrow();
        });
        test('Objects', () => {
            expect(() => Difference.get({ by: By.word, between: { key: 1 }, and: { key: 1 } })).toThrow();
        });
    });

    test('Two strings that are the same', () => {
        const actual = Difference.get({ by: By.word, between: 'Lorem ipsum', and: 'Lorem ipsum' });
        const expected = [{ type: Type.unmodified, text: 'Lorem ipsum' }];
        expect(actual).toStrictEqual(expected);
    });

    test('Two strings that are both empty', () => {
        const actual = Difference.get({ by: By.word, between: '', and: '' });
        const expected = [{ type: Type.unmodified, text: '' }];
        expect(actual).toStrictEqual(expected);
    });

    describe('With two strings where the last has inserts', () => {
        test('To the whole string', () => {
            const actual = Difference.get({ by: By.word, between: '', and: 'Lorem ipsum' });
            const expected = [
                { type: Type.insert, text: 'Lorem ipsum' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('At the start of the string', () => {
            const actual = Difference.get({ by: By.word, between: 'ipsum', and: 'Lorem ipsum' });
            const expected = [
                { type: Type.insert, text: 'Lorem ' },
                { type: Type.unmodified, text: 'ipsum' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('At the end of the string', () => {
            const actual = Difference.get({ by: By.word, between: 'Lorem', and: 'Lorem ipsum' });
            const expected = [
                { type: Type.unmodified, text: 'Lorem' },
                { type: Type.insert, text: ' ipsum' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('In multiple parts of the string', () => {
            const actual = Difference.get({ by: By.word, between: 'Lorem dolor amet', and: 'Lorem ipsum dolor sit amet' });
            const expected = [
                { type: Type.unmodified, text: 'Lorem' },
                { type: Type.insert, text: ' ipsum' },
                { type: Type.unmodified, text: ' dolor ' },
                { type: Type.insert, text: 'sit ' },
                { type: Type.unmodified, text: 'amet' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('Of white space', () => {
            const actual = Difference.get({ by: By.word, between: 'Lorem ipsum dolor sit amet', and: 'Lorem ipsum  dolor  sit amet ' });
            const expected = [
                { type: Type.unmodified, text: 'Lorem ipsum ' },
                { type: Type.insert, text: ' ' },
                { type: Type.unmodified, text: 'dolor' },
                { type: Type.insert, text: ' ' },
                { type: Type.unmodified, text: ' sit amet' },
                { type: Type.insert, text: ' ' },
            ];
            expect(actual).toStrictEqual(expected);
        });
    });

    describe('With two strings where the last has deletes', () => {
        test('To the whole string', () => {
            const actual = Difference.get({ by: By.word, between: 'Lorem ipsum', and: '' });
            const expected = [{ type: Type.delete, text: 'Lorem ipsum' }];
            expect(actual).toStrictEqual(expected);
        });

        test('At the start of the string', () => {
            const actual = Difference.get({ by: By.word, between: 'Lorem ipsum', and: 'ipsum' });
            const expected = [
                { type: Type.delete, text: 'Lorem ' },
                { type: Type.unmodified, text: 'ipsum' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('At the end of the string', () => {
            const actual = Difference.get({ by: By.word, between: 'Lorem ipsum', and: 'Lorem' });
            const expected = [
                { type: Type.unmodified, text: 'Lorem' },
                { type: Type.delete, text: ' ipsum' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('At the start and end of the string', () => {
            const actual = Difference.get({ by: By.word, between: 'Lorem ipsum dolor', and: 'ipsum' });
            const expected = [
                { type: Type.delete, text: 'Lorem ' },
                { type: Type.unmodified, text: 'ipsum' },
                { type: Type.delete, text: ' dolor' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('In multiple parts of the string', () => {
            const actual = Difference.get({ by: By.word, between: 'Lorem ipsum dolor sit amet', and: 'Lorem dolor amet' });
            const expected = [
                { type: Type.unmodified, text: 'Lorem' },
                { type: Type.delete, text: ' ipsum' },
                { type: Type.unmodified, text: ' dolor ' },
                { type: Type.delete, text: 'sit ' },
                { type: Type.unmodified, text: 'amet' },
            ];
            expect(actual).toStrictEqual(expected);
        });

        test('Of white space', () => {
            const actual = Difference.get({ by: By.word, between: 'Lorem ipsum  dolor  sit amet ', and: 'Lorem ipsum dolor sit amet' });
            const expected = [
                { type: Type.unmodified, text: 'Lorem ipsum ' },
                { type: Type.delete, text: ' ' },
                { type: Type.unmodified, text: 'dolor' },
                { type: Type.delete, text: ' ' },
                { type: Type.unmodified, text: ' sit amet' },
                { type: Type.delete, text: ' ' },
            ];
            expect(actual).toStrictEqual(expected);
        });
    });
});

describe('Difference chain syntax', () => {
    test('With two strings where the last has inserts in multiple parts of the string', () => {
        const actual = Difference.by(By.word).between('Lorem dolor amet').and('Lorem ipsum dolor sit amet');
        const expected = [
            { type: Type.unmodified, text: 'Lorem' },
            { type: Type.insert, text: ' ipsum' },
            { type: Type.unmodified, text: ' dolor ' },
            { type: Type.insert, text: 'sit ' },
            { type: Type.unmodified, text: 'amet' },
        ];
        expect(actual).toStrictEqual(expected);
    });
});