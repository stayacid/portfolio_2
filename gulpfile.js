'use strict';

var gulp = require('gulp'),
    gcmq = require('gulp-group-css-media-queries'),
    browserSync = require('browser-sync').create(),
    glp = require('gulp-load-plugins')(),
    include = require('gulp-file-include'),
    del = require('del'),
    gulpIf = require('gulp-if'),
    svgcss = require('gulp-svg-css'),
    pngquant = require('imagemin-pngquant'),
    mozjpeg = require('imagemin-mozjpeg');

/////////////////////////////////////////////////
//---------------------PUG---------------------//
/////////////////////////////////////////////////

gulp.task('pug', function () {
    return gulp.src('src/pug/structure/**/*.pug')
        .pipe(glp.plumber({
            errorHandler: glp.notify.onError(function (err) {
                return {
                    title: 'PUG error',
                    message: err.message
                };
            })
        }))
        .pipe(glp.pug({
            pretty: true
        }))
        .pipe(gulp.dest('build/'))
        .on('end', browserSync.reload)
});

/////////////////////////////////////////////////
//--------------------SASS---------------------//
/////////////////////////////////////////////////

gulp.task('sass', function () {
    return gulp.src('src/sass/style.scss')
        .pipe(glp.plumber({
            errorHandler: glp.notify.onError(function (err) {
                return {
                    title: 'SASS error',
                    message: err.message
                };
            })
        }))
        .pipe(glp.sass())
        .pipe(glp.autoprefixer([
            'last 10 versions'
        ]))
        .pipe(gcmq())
        .pipe(glp.csscomb())
        .pipe(glp.csso({
            restructure: false,
            sourceMap: true,
            debug: true
        }))
        .pipe(glp.rename({
            extname: '.min.css'
        }))
        //.pipe(glp.sourcemaps.write())
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

/////////////////////////////////////////////////
//-------------------SCRIPTS-------------------//
/////////////////////////////////////////////////

gulp.task('scripts:libs', function () {
    return gulp.src(
        [
            'node_modules/jquery/dist/jquery.min.js',
            //'node_modules/jquery-validation/dist/jquery.validate.min.js',
            //'node_modules/slick-carousel/slick/slick.min.js',
            //'node_modules/object-fit-images/dist/ofi.min.js',
            // 'node_modules/imask/dist/imask.min.js',
            //'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js',
            //'node_modules/blazy/blazy.min.js'
        ]
    )
        .pipe(glp.concat('libs.min.js'))
        .pipe(gulp.dest('build/js/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('scripts', function () {
    return gulp.src('src/js/main.js')
        .pipe(glp.plumber({
            errorHandler: glp.notify.onError(function (err) {
                return {
                    title: 'js:include',
                    message: err.message
                };
            })
        }))
        .pipe(include({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(glp.babel({
            presets: ['@babel/env']
        }))
        .pipe(glp.uglify())
        .pipe(glp.rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('build/js/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});


/////////////////////////////////////////////////
//---------------------IMG---------------------//
/////////////////////////////////////////////////

gulp.task('img', function () {
    return gulp.src('src/img/**/*')
        .pipe(glp.cache(glp.imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{
                interlaced: true
            },
                {
                    removeViewBox: false
                },
                {
                    removeUselessStrokeAndFill: false
                },
                {
                    cleanupIDs: false
                }
            ],
            use: [pngquant([{
                quality: '65-80'
            }])],
            use: [mozjpeg([{
                progressive: true,
                quality: 80
            }])]
        })))
        .pipe(gulp.dest('build/img'))
});

gulp.task('imgUpload', function () {
    return gulp.src('src/upload/**/*')
        .pipe(glp.cache(glp.imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{
                interlaced: true
            },
                {
                    removeViewBox: false
                },
                {
                    removeUselessStrokeAndFill: false
                },
                {
                    cleanupIDs: false
                }
            ],
            use: [pngquant([{
                quality: '65-80'
            }])],
            use: [mozjpeg([{
                progressive: true,
                quality: 80
            }])]
        })))
        .pipe(gulp.dest('build/upload'))
});


/////////////////////////////////////////////////
//-----------------CLEAR CACHE-----------------//
/////////////////////////////////////////////////

gulp.task('clear', function () {
    return glp.cache.clearAll();
});

/////////////////////////////////////////////////
//---------------------SVG---------------------//
/////////////////////////////////////////////////

gulp.task('svg', function () {
    return gulp.src('src/svg/*.svg')
        .pipe(glp.svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(glp.cheerio({
            run: function ($) {
                // $('[fill]').removeAttr('fill');
                // $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
                $('[style]').removeAttr('opacity');
            },
            parserOptions: {
                xmlMode: false
            }
        }))
        .pipe(glp.replace('&gt;', '>'))
        .pipe(glp.svgSprite({
            mode: {
                symbol: {
                    sprite: "../sprite.svg",
                    render: {
                        scss: {
                            dest: "../_sprite.scss",
                            template: "src/sass/global/sprite/_sprite_template.scss"
                        }
                    }
                }
            }
        }))
        .pipe(gulpIf('*.scss', gulp.dest('./src/sass/global/sprite'), gulp.dest('./build/img/sprite')))
});

gulp.task('svg:base', function () {
    return gulp.src('src/svg/*.svg')
        .pipe(svgcss({
            fileName: 'css-sprite',
            cssPrefix: 'icon-',
            addSize: false
        }))
        .pipe(gulp.dest('src/sass/global/sprite'));
});

/////////////////////////////////////////////////
//--------------------COPY---------------------//
/////////////////////////////////////////////////

gulp.task('copy', function () {
    return gulp.src('src/files/**/*')
        .pipe(gulp.dest('build/'))
});

/////////////////////////////////////////////////reload
//---------------------DEL---------------------//reload
/////////////////////////////////////////////////

gulp.task('del', function (done) {
    del("build");
    done();
});

/////////////////////////////////////////////////
//--------------------WATCH--------------------//
/////////////////////////////////////////////////

gulp.task('watch', function () {
    gulp.watch('src/pug/**/*.pug', gulp.series('pug'));
    gulp.watch('src/sass/**/*.scss', gulp.series('sass'));
    gulp.watch('src/js/**/*.js', gulp.series('scripts'));
    gulp.watch('src/img/**/*', gulp.series('img'));
    gulp.watch('src/upload/**/*', gulp.series('imgUpload'));
    gulp.watch('src/svg/**/*.svg', gulp.series('svg'));
});

/////////////////////////////////////////////////
//--------------------SERVE--------------------//
/////////////////////////////////////////////////

gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
});

/////////////////////////////////////////////////
//-------------------DEFAULT-------------------//
/////////////////////////////////////////////////

gulp.task('default', gulp.series(
    gulp.parallel('copy', 'img', 'imgUpload', 'svg'),
    gulp.parallel('pug', 'scripts:libs', 'scripts', 'sass'),
    gulp.parallel('watch', 'serve')
));

/////////////////////////////////////////////////
//--------------------BUILD--------------------//
/////////////////////////////////////////////////

gulp.task('build', gulp.series(
    ['copy', 'img', 'imgUpload', 'svg', 'pug', 'sass', 'scripts:libs', 'scripts']
));