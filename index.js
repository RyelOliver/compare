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

            return [{ status: unmodified, value: oldValue }];
        },
    }),
};

module.exports = {
    status,
    characters,
};