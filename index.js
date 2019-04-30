const unmodified = 'unmodified';
const added = 'added';
const removed = 'removed';

const status = {
    unmodified,
    added,
    removed,
};

const characters = {
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