'use strict';

const browserify      = require('browserify');
const watchify        = require('watchify');
const del             = require('del');
const gulp            = require('gulp');
const plugins         = require('gulp-load-plugins')();
const source          = require('vinyl-source-stream');
const sequence        = require('run-sequence');
const merge           = require('merge-stream');
const bowerFiles      = require('main-bower-files');
const fs              = require('fs');

const pkg = require('./package.json');
const devBuild = plugins.util.env.release ? '' : ' (dev build at ' + (new Date()).toUTCString() + ')';

const assetPaths = {
    htmls: ['./*.html'],
    jsSrc: ['./src/**/*'],
    jsLib: ['./dist/**/*'],
    style: ['./assets/styles/**/*.css'],
    asset: ['./assets/**/*', '!./assets/**/*.css'],
    fonts: ['bower_components/fontawesome/fonts/*',
            'bower_components/bootstrap/dist/fonts/*',
            'bower_components/react-widgets/dist/fonts/*']
};

const distHeader = '/*!\n\
 * <%= pkg.name %> <%= pkg.version %><%= devBuild %> - <%= pkg.homepage %>\n\
 * <%= pkg.license %> Licensed\n\
 */\n';

// Helper Functions
function browserifyShared (watch) {
    let b = browserify({
        debug: watch,
        transform: [['babelify', { 'stage': 0 }]],
        cache: {},
        packageCache: {},
        fullPaths: watch
    });
    
    // If we'll continue to watch for changes,
    // cache and speed up future builds
    if (watch) {
        watchify(b);
        b.on('update', function () {
            bundleShared(b, watch);
        });
    }

    b.add('./src/index.js');
    bundleShared(b, watch);
}

function bundleShared (b, watch) {
    let start = new Date().getTime();
    let stream = b.bundle()
        .pipe(source('index.debug.js'))
        .pipe(plugins.streamify(plugins.header(distHeader, { pkg: pkg, devBuild: devBuild })))
        .pipe(gulp.dest('./dist/js'));
    
    if (!watch) {
        // We're not watching, let's build a production version
        stream = stream.pipe(plugins.rename('index.min.js'))
            .pipe(plugins.streamify(plugins.uglify()))
            .pipe(plugins.streamify(plugins.header(distHeader, { pkg: pkg, devBuild: devBuild })))
            .pipe(gulp.dest('./dist/js'))
            .pipe(plugins.exit());
    } else {
        stream = stream.pipe(plugins.livereload());
    }
    
    let time = new Date().getTime() - start;
    plugins.util.log('Browserify bundle took ', plugins.util.colors.cyan(time + ' ms'));
    return stream;    
}
 
// Gulp Tasks
gulp.task('clean', () => {
    return del(assetPaths.jsLib);
});

gulp.task('clean-copy', (cb) => {
    sequence('clean', 'copy-assets', 'bower-concat', 'css-concat', cb);
})

gulp.task('config-env', (cb) => {
    var AZURE_CONFIG_PROPS = ['APPINSIGHTS_INSTRUMENTATIONKEY', 'OCHA_BLOB_HOSTNAME', 'TIMESERIES_BLOB', 
                              'AAD_AUTH_CLIENTID', 'SERVICE_URL', 'EMOTIONMAPS_BLOB', 'OCHA_TERMS_TBL_CONN',
                              'TRENDING_BLOB'];
    var configFile = './config.json';
    var configurationEnv = {};
    
    AZURE_CONFIG_PROPS.forEach((item) => {
              if (process.env[item])
                  configurationEnv[item] = process.env[item];
    });
        
    try{
        fs.writeFile(configFile, JSON.stringify(configurationEnv), cb);
    }catch(e){
        fs.end();
    }
});

gulp.task('bundle-js', () => {
    return browserifyShared(false);
});

gulp.task('bundle-js-debug-watch', () => {
    return browserifyShared(true);
});

gulp.task('copy-assets', () => {
    const htmls = gulp.src(assetPaths.htmls)
        .pipe(gulp.dest('./dist'));
        
    const fonts = gulp.src(assetPaths.fonts)
        .pipe(gulp.dest('./dist/fonts'));
        
    const assets = gulp.src(assetPaths.asset)
        .pipe(gulp.dest('./dist/assets'));
        
    return merge(htmls, fonts, assets);
})

gulp.task('watch', ['clean-copy'], () => {
    const joinedAssets = assetPaths.asset.concat(assetPaths.htmls).concat(assetPaths.fonts);
    const assetWatcher = gulp.watch(joinedAssets, ['reload-assets']);
    const cssWatcher = gulp.watch(assetPaths.style, ['reload-css']);
    
    assetWatcher.on('change', (event) => {
        plugins.util.log('Asset ' + event.path + ' was ' + event.type + ', reloading...');
    });
    
    cssWatcher.on('change', (event) => {
        plugins.util.log('CSS ' + event.path + ' was ' + event.type + ', reloading...');
    });

    plugins.livereload.listen();
    return browserifyShared(true);
});

gulp.task('bower-concat', function () {
    const css = gulp.src(bowerFiles('**/*.css'))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('vendor.min.css'))
        .pipe(plugins.cssnano())
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/vendor'));
    
    const js = gulp.src(bowerFiles('**/*.js'))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.streamify(plugins.uglify()))
        .pipe(plugins.concat('vendor.min.js'))
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/vendor'));
    
    return merge(css, js);
});

gulp.task('css-concat', () => {
    return gulp.src(assetPaths.style)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('main.css'))
        .pipe(plugins.cssnano())
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/assets/styles'));
});

gulp.task('reload', () => {
    plugins.livereload.reload();
});

gulp.task('reload-assets', (cb) => {
    sequence('copy-assets', 'reload', cb);
});

gulp.task('reload-css', (cb) => {
    sequence('css-concat', 'reload', cb);
});

gulp.task('build', function (cb) {
   sequence('clean-copy', 'config-env', 'bundle-js', cb); 
});

gulp.task('default', ['watch']);