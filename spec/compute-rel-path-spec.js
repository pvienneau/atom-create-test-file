'use babel';

import { computeRelPath } from '../lib/create-test-files';

describe('computeRelPath', () => {
    it('should resolve a relative path to its base path', () => {
        const basePath = '/hello/sanchez.js';
        const relativePath = '../world';
        const expectedPath = '/hello/world';

        const actualPath = computeRelPath(basePath, relativePath);

        expect(actualPath).toEqual(expectedPath);
    });

    describe('Wildcard relative paths (*)', () => {
        it('should set the file name as the first wildcard key', () => {
            const expectedPath = 'hello/world.spec.js';

            const actualPath = computeRelPath('hello/world.js', '../*.spec.js');

            expect(actualPath).toEqual(expectedPath);
        });

        it('should set the file extension as the second wildcard key', () => {
            const expectedPath = 'hello/world.spec.xyz';

            const actualPath = computeRelPath('hello/world.xyz', '../*.spec.*');

            expect(actualPath).toEqual(expectedPath);
        });
    });
});
