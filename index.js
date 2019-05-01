const unmodified = 'unmodified';
const added = 'added';
const removed = 'removed';

const status = {
    unmodified,
    added,
    removed,
};

const characters = {
    longestUnmodified: {
        of: longerValue => ({
            with: shorterValue => {
                // See if the shorterValue exists within the longerValue
                if (longerValue.includes(shorterValue))
                    return shorterValue;
                // If it doesn't and it's one character, then there's no unmodified string
                if (shorterValue.length === 1)
                    return '';
            
                // See if a substring of the shorterValue exists within the longerValue
                for (let shortenBy = 1; shortenBy < shorterValue.length; shortenBy++) {
                    // Try substrings with one less character until one exists within the longerValue
                    for (let startChar = 0; startChar <= shortenBy; startChar++) {
                        const endChar = shorterValue.length - (shortenBy - startChar);
                        const evenshorterValue = shorterValue.substring(startChar, endChar);
            
                        if (longerValue.includes(evenshorterValue))
                            return evenshorterValue;
                    }
                }
                
                return '';
            },
        }),
    },
    of: oldValue => ({
        with: newValue => {
            if (typeof oldValue !== 'string' || typeof newValue !== 'string')
                throw new TypeError('Two strings must be provided for comparisons');

            if (!oldValue && !newValue)
                return [{ status: unmodified, value: '' }];

            if (!oldValue)
                return [{ status: added, value: newValue }];
            
            if (!newValue)
                return [{ status: removed, value: oldValue }];

            if (newValue === oldValue)
                return [{ status: unmodified, value: newValue }];
        
            let compared = [];
            const oldValueLength = oldValue.length;
            const newValueLength = newValue.length;
        
            // If newValue is longer, something was added
            if (newValueLength >= oldValueLength) {
                const unmodifiedValue = characters.longestUnmodified.of(newValue).with(oldValue);
        
                if (!unmodifiedValue) {
                    compared.push({ status: removed, value: oldValue });
                    compared.push({ status: added, value: newValue });
                } else {
                    const unmodifiedValueLength = unmodifiedValue.length;
                    const oldUnmodifiedValueStart = oldValue.indexOf(unmodifiedValue);
                    const newUnmodifiedValueStart = newValue.indexOf(unmodifiedValue);
                    const beforeNewUnmodifiedValue = newValue.substring(0, newUnmodifiedValueStart);
                    const afterNewUnmodifiedValue = newValue.substring(newUnmodifiedValueStart + unmodifiedValueLength);
                    const beforeOldUnmodifiedValue = oldValue.substring(0, oldUnmodifiedValueStart);
                    const afterOldUnmodifiedValue = oldValue.substring(oldUnmodifiedValueStart + unmodifiedValueLength);
            
                    if (beforeOldUnmodifiedValue || beforeNewUnmodifiedValue)
                        compared = compared.concat(characters.of(beforeOldUnmodifiedValue).with(beforeNewUnmodifiedValue));
            
                    if (unmodifiedValue)
                        compared.push({ status: unmodified, value: unmodifiedValue });
                        
                    if (afterOldUnmodifiedValue || afterNewUnmodifiedValue)
                        compared = compared.concat(characters.of(afterOldUnmodifiedValue).with(afterNewUnmodifiedValue));
                }
            // If oldValue is longer, something was removed
            } else {
                const unmodifiedValue = characters.longestUnmodified.of(oldValue).with(newValue);
        
                if (!unmodifiedValue) {
                    compared.push({ status: removed, value: oldValue });
                    compared.push({ status: added, value: newValue });
                } else {
                    const unmodifiedValueLength = unmodifiedValue.length;
                    const newUnmodifiedValueStart = newValue.indexOf(unmodifiedValue);
                    const oldUnmodifiedValueStart = oldValue.indexOf(unmodifiedValue);
                    const beforeOldUnmodifiedValue = oldValue.substring(0, oldUnmodifiedValueStart);
                    const afterOldUnmodifiedValue = oldValue.substring(oldUnmodifiedValueStart + unmodifiedValueLength);
                    const beforeNewUnmodifiedValue = newValue.substring(0, newUnmodifiedValueStart);
                    const afterNewUnmodifiedValue = newValue.substring(newUnmodifiedValueStart + unmodifiedValueLength);
        
                    if (beforeOldUnmodifiedValue || beforeNewUnmodifiedValue)
                        compared = compared.concat(characters.of(beforeOldUnmodifiedValue).with(beforeNewUnmodifiedValue));
        
                    if (unmodifiedValue)
                        compared.push({ status: unmodified, value: unmodifiedValue });
                    
                    if (afterOldUnmodifiedValue || afterNewUnmodifiedValue)
                        compared = compared.concat(characters.of(afterOldUnmodifiedValue).with(afterNewUnmodifiedValue));
                }
            }
        
            return compared;
        },
    }),
};

const words = {
    longestUnmodified: {
        of: longerValue => ({
            with: shorterValue => {
                // See if the shorterValue exists within the longerValue
                if (longerValue.includes(shorterValue))
                    return shorterValue;

                // Could include an option to group whitespace, /(\s+)/
                // Could include an option to ignore whitespace, /\s+/
                const shorterValueList = shorterValue.split(/(\s)/);

                // If it doesn't and it's one word, then there's no unmodified string
                if (shorterValueList.length === 1)
                    return '';
            
                // See if a substring of the shorterValue exists within the longerValue
                for (let shortenBy = 1; shortenBy < shorterValueList.length; shortenBy++) {
                    // Try substrings with one less word until one exists within the longerValue
                    for (let startWord = 0; startWord <= shortenBy; startWord++) {
                        const endWord = shorterValueList.length - (shortenBy - startWord);
                        const evenshorterValue = shorterValueList.slice(startWord, endWord).join('');
            
                        if (longerValue.includes(evenshorterValue))
                            return evenshorterValue;
                    }
                }
                
                return '';
            },
        }),
    },
    of: oldValue => ({
        with: newValue => {
            if (typeof oldValue !== 'string' || typeof newValue !== 'string')
                throw new TypeError('Two strings must be provided for comparisons');

            if (!oldValue && !newValue)
                return [{ status: unmodified, value: '' }];

            if (!oldValue)
                return [{ status: added, value: newValue }];
            
            if (!newValue)
                return [{ status: removed, value: oldValue }];

            if (newValue === oldValue)
                return [{ status: unmodified, value: newValue }];
            
            let compared = [];
            const oldValueLength = oldValue.length;
            const newValueLength = newValue.length;
        
            // If newValue is longer, something was added
            if (newValueLength >= oldValueLength) {
                const unmodifiedValue = words.longestUnmodified.of(newValue).with(oldValue);
        
                if (!unmodifiedValue) {
                    compared.push({ status: removed, value: oldValue });
                    compared.push({ status: added, value: newValue });
                } else {
                    const unmodifiedValueLength = unmodifiedValue.length;
                    const oldUnmodifiedValueStart = oldValue.indexOf(unmodifiedValue);
                    const newUnmodifiedValueStart = newValue.indexOf(unmodifiedValue);
                    const beforeNewUnmodifiedValue = newValue.substring(0, newUnmodifiedValueStart);
                    const afterNewUnmodifiedValue = newValue.substring(newUnmodifiedValueStart + unmodifiedValueLength);
                    const beforeOldUnmodifiedValue = oldValue.substring(0, oldUnmodifiedValueStart);
                    const afterOldUnmodifiedValue = oldValue.substring(oldUnmodifiedValueStart + unmodifiedValueLength);
                        
                    if (beforeOldUnmodifiedValue || beforeNewUnmodifiedValue)
                        compared = compared.concat(words.of(beforeOldUnmodifiedValue).with(beforeNewUnmodifiedValue));
            
                    if (unmodifiedValue)
                        compared.push({ status: unmodified, value: unmodifiedValue });

                    if (afterOldUnmodifiedValue || afterNewUnmodifiedValue)
                        compared = compared.concat(words.of(afterOldUnmodifiedValue).with(afterNewUnmodifiedValue));
                }
            // If oldValue is longer, something was removed
            } else {
                const unmodifiedValue = words.longestUnmodified.of(oldValue).with(newValue);
            
                if (!unmodifiedValue) {
                    compared.push({ status: removed, value: oldValue });
                    compared.push({ status: added, value: newValue });
                } else {
                    const unmodifiedValueLength = unmodifiedValue.length;
                    const newUnmodifiedValueStart = newValue.indexOf(unmodifiedValue);
                    const oldUnmodifiedValueStart = oldValue.indexOf(unmodifiedValue);
                    const beforeOldUnmodifiedValue = oldValue.substring(0, oldUnmodifiedValueStart);
                    const afterOldUnmodifiedValue = oldValue.substring(oldUnmodifiedValueStart + unmodifiedValueLength);
                    const beforeNewUnmodifiedValue = newValue.substring(0, newUnmodifiedValueStart);
                    const afterNewUnmodifiedValue = newValue.substring(newUnmodifiedValueStart + unmodifiedValueLength);
            
                    if (beforeOldUnmodifiedValue || beforeNewUnmodifiedValue)
                        compared = compared.concat(words.of(beforeOldUnmodifiedValue).with(beforeNewUnmodifiedValue));
            
                    if (unmodifiedValue)
                        compared.push({ status: unmodified, value: unmodifiedValue });
                        
                    if (afterOldUnmodifiedValue || afterNewUnmodifiedValue)
                        compared = compared.concat(words.of(afterOldUnmodifiedValue).with(afterNewUnmodifiedValue));
                }
            }

            return compared;
        },
    }),
};

module.exports = {
    status,
    characters,
    words,
};