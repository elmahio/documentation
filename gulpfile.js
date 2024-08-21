"use strict";

const gulp = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const concat = require("gulp-concat");
const cssmin = require("gulp-cssmin");
const uglify = require("gulp-terser");
const merge = require("merge-stream");
const replace = require("gulp-replace");
const sourcemaps = require("gulp-sourcemaps");
const bundleconfig = require("./bundleconfig.json");
    
const regex = {
    css: /\.css$/,
    js: /\.js$/
};

function getBundles(regexPattern) {
    return bundleconfig.filter(function (bundle) {
        return regexPattern.test(bundle.outputFileName);
    });
}

// Compile SCSS(SASS) style file
gulp.task("compile:scss", function (done) {
    gulp.src(['./mkdocs_bs5/assets/scss/bootstrap.scss', './mkdocs_bs5/assets/scss/style.scss', './mkdocs_bs5/assets/scss/dark-theme.scss'])
        .pipe(sass.sync({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./mkdocs_bs5/assets/css'))
        .on('end', done);
});

gulp.task("min:js", function () {
    var tasks = getBundles(regex.js).map(function (bundle) {
        return gulp.src(bundle.inputFiles, { base: "." })
            .pipe(sourcemaps.init())
            .pipe(concat(bundle.outputFileName))
            .pipe(uglify())
            .pipe(sourcemaps.write(".", {addComment: false}))
            .pipe(gulp.dest("."));
    });
    return merge(tasks);
});

gulp.task("min:css", function () {
    var tasks = getBundles(regex.css).map(function (bundle) {
        return gulp.src(bundle.inputFiles, { base: "." })
            .pipe(replace('../webfonts/', '../fonts/font-awesome/webfonts/'))
            .pipe(concat(bundle.outputFileName))
            .pipe(cssmin())
            .pipe(gulp.dest("."));
    });
    return merge(tasks);
});

const compile = gulp.series(gulp.task('compile:scss'));

gulp.task('watcher', function() {
    gulp.watch('./mkdocs_bs5/assets/scss/**', compile);
});

gulp.task("min", gulp.series([compile, "min:js", "min:css"]));