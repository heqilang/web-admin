import gulp from 'gulp';
import { Generate } from './gulpClass/generateApi.js';

gulp.task('generateApi', async function () {
  return new Generate('src/entity', 'src/api').start();
});
