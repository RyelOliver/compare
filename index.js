const Difference = {
    By: {
        character: 'character',
        word: 'word',
    },
    Type: {
        unmodified: 'unmodified',
        insert: 'insert',
        delete: 'delete',
    },
    longestUnmodified: function({ by = Difference.By.word, between, and }) {
        if (between === undefined || typeof between !== 'string' ||
            and === undefined || typeof and !== 'string')
            throw TypeError('Two strings must be provided to return their differences');

        const longerValue = between;
        let shorterValue = and;

        // See if the shorterValue exists within the longerValue
        if (longerValue.includes(shorterValue))
            return shorterValue;

        // Could include an option to group whitespace, /(\s+)/
        // Could include an option to ignore whitespace, /\s+/
        if (by === Difference.By.word)
            shorterValue = shorterValue.split(/(\s)/);

        // If it's one character or word, then there's no unmodified string
        if (shorterValue.length === 1)
            return '';
    
        // See if a substring of the shorterValue exists within the longerValue
        for (let shortenBy = 1; shortenBy < shorterValue.length; shortenBy++) {
            // Try substrings with one less character or word until one exists within the longerValue
            for (let startCharOrWord = 0; startCharOrWord <= shortenBy; startCharOrWord++) {
                const endCharOrWord = shorterValue.length - (shortenBy - startCharOrWord);
                const evenShorterValue = by === Difference.By.word ? shorterValue.slice(startCharOrWord, endCharOrWord).join('') : shorterValue.substring(startCharOrWord, endCharOrWord);

                if (longerValue.includes(evenShorterValue))
                    return evenShorterValue;
            }
        }
        
        return '';
    },
    get: function({ by = Difference.By.word, between, and }) {
        if (between === undefined || typeof between !== 'string' ||
            and === undefined || typeof and !== 'string')
            throw TypeError('Two strings must be provided to return their differences');
            
        const oldValue = between;
        const newValue = and;

        if (!oldValue && !newValue)
            return [{ type: Difference.Type.unmodified, text: '' }];

        if (!oldValue)
            return [{ type: Difference.Type.insert, text: newValue }];
        
        if (!newValue)
            return [{ type: Difference.Type.delete, text: oldValue }];

        if (newValue === oldValue)
            return [{ type: Difference.Type.unmodified, text: newValue }];
    
        let compared = [];
        const oldValueLength = oldValue.length;
        const newValueLength = newValue.length;
    
        // If newValue is longer, something was inserted
        if (newValueLength >= oldValueLength) {
            const unmodifiedValue = Difference.longestUnmodified({ by, between: newValue, and: oldValue });
    
            if (!unmodifiedValue) {
                compared.push({ type: Difference.Type.insert, text: newValue });
                compared.push({ type: Difference.Type.delete, text: oldValue });
            } else {
                const unmodifiedValueLength = unmodifiedValue.length;
                const oldUnmodifiedValueStart = oldValue.indexOf(unmodifiedValue);
                const newUnmodifiedValueStart = newValue.indexOf(unmodifiedValue);
                const beforeNewUnmodifiedValue = newValue.substring(0, newUnmodifiedValueStart);
                const afterNewUnmodifiedValue = newValue.substring(newUnmodifiedValueStart + unmodifiedValueLength);
                const beforeOldUnmodifiedValue = oldValue.substring(0, oldUnmodifiedValueStart);
                const afterOldUnmodifiedValue = oldValue.substring(oldUnmodifiedValueStart + unmodifiedValueLength);
        
                if (beforeOldUnmodifiedValue || beforeNewUnmodifiedValue)
                    compared = compared.concat(Difference.get({ by, between: beforeOldUnmodifiedValue, and: beforeNewUnmodifiedValue }));
        
                if (unmodifiedValue)
                    compared.push({ type: Difference.Type.unmodified, text: unmodifiedValue });
                    
                if (afterOldUnmodifiedValue || afterNewUnmodifiedValue)
                    compared = compared.concat(Difference.get({ by, between: afterOldUnmodifiedValue, and: afterNewUnmodifiedValue }));
            }
        // If oldValue is longer, something was deleted
        } else {
            const unmodifiedValue = Difference.longestUnmodified({ by, between: oldValue, and: newValue });
            
            if (!unmodifiedValue) {
                compared.push({ type: Difference.Type.insert, text: newValue });
                compared.push({ type: Difference.Type.delete, text: oldValue });
            } else {
                const unmodifiedValueLength = unmodifiedValue.length;
                const newUnmodifiedValueStart = newValue.indexOf(unmodifiedValue);
                const oldUnmodifiedValueStart = oldValue.indexOf(unmodifiedValue);
                const beforeOldUnmodifiedValue = oldValue.substring(0, oldUnmodifiedValueStart);
                const afterOldUnmodifiedValue = oldValue.substring(oldUnmodifiedValueStart + unmodifiedValueLength);
                const beforeNewUnmodifiedValue = newValue.substring(0, newUnmodifiedValueStart);
                const afterNewUnmodifiedValue = newValue.substring(newUnmodifiedValueStart + unmodifiedValueLength);
    
                if (beforeOldUnmodifiedValue || beforeNewUnmodifiedValue)
                    compared = compared.concat(Difference.get({ by, between: beforeOldUnmodifiedValue, and: beforeNewUnmodifiedValue }));
    
                if (unmodifiedValue)
                    compared.push({ type: Difference.Type.unmodified, text: unmodifiedValue });
                
                if (afterOldUnmodifiedValue || afterNewUnmodifiedValue)
                    compared = compared.concat(Difference.get({ by, between: afterOldUnmodifiedValue, and: afterNewUnmodifiedValue }));
            }
        }
    
        return compared;
    },
    by: function(by) {
        return {
            between: function(between) {
                return {
                    and: function(and) {
                        return Difference.get({ by, between, and });
                    },
                };
            },
        };
    },
};

module.exports = Difference;