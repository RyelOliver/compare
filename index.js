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
            
                    // If this is all of the oldValue, before and after of the newValue is all added
                    if (oldUnmodifiedValueStart === 0 && unmodifiedValueLength === oldValueLength) {
                        if (beforeNewUnmodifiedValue)
                            compared.push({ status: added, value: beforeNewUnmodifiedValue });
                
                        if (unmodifiedValue)
                            compared.push({ status: unmodified, value: unmodifiedValue });
                        
                        if (afterNewUnmodifiedValue)
                            compared.push({ status: added, value: afterNewUnmodifiedValue });
                    } else {
                        const beforeOldUnmodifiedValue = oldValue.substring(0, oldUnmodifiedValueStart);
                        const afterOldUnmodifiedValue = oldValue.substring(oldUnmodifiedValueStart + unmodifiedValueLength);
            
                        compared = compared.concat(characters.of(beforeOldUnmodifiedValue).with(beforeNewUnmodifiedValue));
            
                        if (unmodifiedValue)
                            compared.push({ status: unmodified, value: unmodifiedValue });
                        
                        compared = compared.concat(characters.of(afterOldUnmodifiedValue).with(afterNewUnmodifiedValue));
                    }
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
                
                    // If this is all of the newValue, before and after of the oldValue is all removed
                    if (newUnmodifiedValueStart === 0 && unmodifiedValueLength === newValueLength) {
                        if (beforeOldUnmodifiedValue)
                            compared.push({ status: removed, value: beforeOldUnmodifiedValue });
        
                        if (unmodifiedValue)
                            compared.push({ status: unmodified, value: unmodifiedValue });
                    
                        if (afterOldUnmodifiedValue)
                            compared.push({ status: removed, value: afterOldUnmodifiedValue });
                    } else {
                        const beforeNewUnmodifiedValue = newValue.substring(0, newUnmodifiedValueStart);
                        const afterNewUnmodifiedValue = newValue.substring(newUnmodifiedValueStart + unmodifiedValueLength);
        
                        compared = compared.concat(characters.of(beforeOldUnmodifiedValue).with(beforeNewUnmodifiedValue));
        
                        if (unmodifiedValue)
                            compared.push({ status: unmodified, value: unmodifiedValue });
                    
                        compared = compared.concat(characters.of(afterOldUnmodifiedValue).with(afterNewUnmodifiedValue));
                    }
                }
            }
        
            return compared;
        },
    }),
};

module.exports = {
    status,
    characters,
};