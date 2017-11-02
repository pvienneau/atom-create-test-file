'use babel';

export default {
    testRelPath: {
        title: 'Test File Relative Path',
        description:
            'Define a path for where the test file should be created relative to your file. Set an astersk in the file name wherever you want this to be automatically generated.',
        type: 'string',
        default: '../__tests__/*.spec.*',
    },
};
