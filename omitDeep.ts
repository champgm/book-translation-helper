import _ from 'lodash';

export function omitDeep(collection: object, excludeKeys: string[]) {
    return _.cloneDeepWith(collection, (value) => {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            excludeKeys.forEach((key) => {
                delete value[key];
            });
        }
    });
}
