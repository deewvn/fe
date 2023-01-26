import gulp from 'gulp';
import rigger from 'gulp-rigger';
import plumber from 'gulp-plumber';
import { deleteAsync } from 'del';
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';
import cache from 'gulp-cache';
import autoprefixer from 'gulp-autoprefixer';
import minifyCss from 'gulp-minify-css';
import include from 'gulp-file-include';
import browserSync from 'browser-sync';

import gulpSass from 'gulp-sass';
import nodeSass from 'node-sass';
const sass = gulpSass(nodeSass);

const path = {
        html: ['app/*.html'],
        scss: ['app/styles/index.scss'],
        img: ['app/assets/img/**'],
        favicon: ['app/favicon.ico'],
        scripts: ['app/scripts/**'],
        font: ['app/assets/fonts/*.ttf']
      }

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'dist'
        },
        notify: false
    });
});

gulp.task('clean', function () {
    return deleteAsync(['dist']);
});

gulp.task('html', function () {
    return gulp.src(path.html, { allowEmpty: true })
        .pipe(plumber())
        .pipe(rigger())
        .pipe(include())
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('styles', function () {
    return gulp.src(path.scss, { allowEmpty: true })
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer(['last 15 versions', '>1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(minifyCss())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('script', function(){
    return gulp.src(path.scripts, { allowEmpty: true })
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('font', function(){
    return gulp.src(path.font)
        .pipe(gulp.dest('dist/assets/fonts'));
});

gulp.task('img', function(){
    return gulp.src(path.img, { allowEmpty: true })
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/assets/img'));
});

gulp.task('favicon', function(){
    return gulp.src(path.favicon, { allowEmpty: true })
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function(){
    gulp.watch('app/**/*.html', gulp.series('html'));
    gulp.watch('app/**/*.scss', gulp.series('styles'));
    gulp.watch('app/**/*.js', gulp.series('script'));
});

gulp.task('build', gulp.series('clean', 'html', 'styles', 'font', 'img', 'script'), function(){});

gulp.task('go', gulp.series('build', gulp.parallel('browser-sync', 'watch')), function(){});
