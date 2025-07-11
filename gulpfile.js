const path = require('path');
const { task, src, dest, series } = require('gulp');

task('build:icons', copyIcons);

function copyIcons() {
    const nodeSource = path.resolve('nodes', '**', '*.{png,svg}');
    const nodeDestination = path.resolve('dist', 'nodes');

    src(nodeSource).pipe(dest(nodeDestination));

    const credSource = path.resolve('credentials', '**', '*.{png,svg}');
    const credDestination = path.resolve('dist', 'credentials');

    return src(credSource).pipe(dest(credDestination));
}

task('build:package', series('build:icons', copyPackageFiles));

function copyPackageFiles() {
    return src([
        'package.json',
        'credentials/**/*.js',
    ], { base: '.' })
        .pipe(dest('dist'));
}