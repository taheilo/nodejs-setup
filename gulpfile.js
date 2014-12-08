var gulp = require('./build')([
    // 'sass',
    // 'browserify',
    'nodemon',
    // 'setWatch',
    // 'watch',
    // 'coffee',
    // 'optimize'
]);

// gulp.task('build', ['sass', 'browserify', 'optimize']);
// gulp.task('default', ['setWatch', 'sass', 'browserify', 'nodemon', 'watch']);
gulp.task('default', ['nodemon']);
