'use babel';

import path from 'path';
import fs from 'fs';
import Promise from 'bluebird';
import { CompositeDisposable, File, Directory } from 'atom';

import config from './config';

export default {
    activate(state) {
        this.subscriptions = new CompositeDisposable();

        this.subscriptions.add(
            atom.commands.add(
                '.tree-view .file .name, .tree-view .directory .name',
                {
                    'create-test-file:tree': () =>
                        this.createTestFilesForTree(),
                }
            )
        );

        this.subscriptions.add(
            atom.commands.add('atom-workspace', {
                'create-test-file:run': () =>
                    this.createTestFileForActiveTextEditor(),
            })
        );
    },
    deactivate() {
        this.subscriptions.dispose();
    },
    createTestFilesForTree() {
        const treeView = atom.packages.getLoadedPackage('tree-view');

        if (treeView) {
            const paths = require(treeView.mainModulePath)
                .treeView.selectedPaths()
                .reduce((acc, path) => {
                    if (!fs.lstatSync(path).isDirectory())
                        return acc.concat(path);

                    const directory = new Directory(path);

                    return acc.concat(
                        directory
                            .getEntriesSync()
                            .filter(entry => entry.isFile())
                            .map(entry => entry.getPath())
                    );
                }, []);

            this.createTestFiles(paths);
        }
    },
    createTestFileForActiveTextEditor() {
        this.createTestFiles(atom.workspace.getActiveTextEditor().getPath());
    },
    createTestFiles(path) {
        const paths = Array.isArray(path) ? path : [path];
        const testRelPath = atom.config.get('create-test-files.testRelPath');

        Promise.mapSeries(paths, filePath => {
            const file = new File(this.computeRelPath(filePath, testRelPath));

            return file.create().then(() => file);
        }).then(files => {
            if (files.length === 1) atom.workspace.open(files[0].getPath());

            atom.notifications.addSuccess(
                `Created ${files.length} test file${files.length === 1
                    ? ''
                    : 's'}.`
            );
        });
    },
    computeRelPath(filePath, relPath) {
        const fileObj = path.parse(filePath);

        const modifiers = [fileObj.name, fileObj.ext.substr(1)];

        return path.join(
            filePath,
            modifiers.reduce(
                (acc, modifier) => acc.replace('*', modifier),
                relPath
            )
        );
    },
    config,
};
