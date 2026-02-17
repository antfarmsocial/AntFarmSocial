import gulp from 'gulp';
import fs from 'fs';
import path  from 'path';
import terser from 'gulp-terser';
import rename from 'gulp-rename';
import lightningcss from 'gulp-lightningcss';
import {Features} from 'lightningcss';
import replace from 'gulp-replace';
import concat from 'gulp-concat';
import htmlmin from 'gulp-htmlmin';
import hypercrush from 'hypercrush';
import jcrushSVG from 'jcrushsvg';
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import stripCode from 'gulp-strip-code';
import {gzipSizeSync} from 'gzip-size';

var isDev = process.argv.includes('--dev');

gulp.task('svgItems', function (done) {
  jcrushSVG({ inDir: 'src/img/items', outFile: 'src/temp/svgItems.js', checkNew: 1, param: 1,
    bundle: 1, maxLen: 120, funcName: 'SVG', resVars: ['bg', 'fg', 'op'],
    processSVG: (filePath, svgContent) => {
      // Validates the SVG file for version and color usage
      if (svgContent.includes('version=') && !svgContent.includes('version="1.1"')) // Check if version="1.1" exists
        throw new Error(`SVG in ${filePath} does not have version="1.1". Ensure you set "SVG Profile: SVG 1.1" in save-as dialogue of Adobe Illustrator.`);
      if (svgContent.match(/<style[^>]*>[\s\S]*?<\/style>/g)) // Check for style tags
        throw new Error(`SVG in ${filePath} contains <style> tags, which are not allowed. Ensure you set "CSS Properties: Presentation Attributes" in save-as dialogue of Adobe Illustrator.`);
      if (/style\s*=\s*["'][^"']*color\s*:/i.test(svgContent)) // Check if it uses CSS for colors (and if so, throw an error)
        throw new Error(`SVG in ${filePath} uses CSS for colors, which is not allowed. Ensure you set "CSS Properties: Presentation Attributes" in save-as dialogue of Adobe Illustrator.`);
      // Replaces color codes with placeholders
      svgContent = svgContent.replace(new RegExp('#64bc41', 'gi'), '🟩'); // Background
      if (!filePath.includes('paint') && !filePath.includes('ants')) {
        svgContent = svgContent
          .replace(/#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}/gi, '⬛') // Foreground
          .replace(/opacity="([^"]+)"/gi, 'opacity="🔲"'); // Opacity
      }
      return svgContent.trim();
    },
    processJS:(filePath, jsContent) => {
      return jsContent.replace('(k,', '(k,bg,fg,op,')
        .replace(/🟩/g, '${bg}')
        .replace(/⬛/g, '${fg}')
        .replace(/🔲/g, '${op}');
    },
  });
  done(); // Signal completion
});

gulp.task('imagemin', function (done) {
  let dirs = [
    {in: './src/img', out: './img', q: 50 },
    {in: './src/img/bg', out: './img/bg', q: 35 },
  ];
  for (const { in: inDir, out: outDir, q: q } of dirs) {
    // Check if files are outdated.
    if (
      Math.max(...fs.readdirSync(inDir).filter(f => /\.(png|jpg)$/i.test(f)).map(f => fs.statSync(path.join(inDir, f)).mtimeMs)) >= Math.max(...fs.readdirSync(outDir).map(f => fs.statSync(path.join(outDir, f)).mtimeMs)) ||
      fs.readdirSync(inDir).some(f => /\.(png|jpg)$/i.test(f) && !fs.existsSync(path.join(outDir, f.replace(/\.(png|jpg)$/i, '.webp'))))
    ) {
      /**
       * Sometimes this code seems to trigger without warrant.  The following lines can debug the situation.  Sometimes timestamps are just wrong?
       */
      //console.log('Triggered because:', Math.max(...fs.readdirSync(inDir).filter(f => /\.(png|jpg)$/i.test(f)).map(f => fs.statSync(path.join(inDir, f)).mtime)), '>=', Math.max(...fs.readdirSync(outDir).map(f => fs.statSync(path.join(outDir, f)).mtime)));
      //console.log('Missing webp files:', fs.readdirSync(inDir).filter(f => /\.(png|jpg)$/i.test(f) && !fs.existsSync(path.join(outDir, f.replace(/\.(png|jpg)$/i, '.webp')))));
      //fs.readdirSync(inDir).filter(f => /\.(png|jpg)$/i.test(f)).map(f => ({ f, time: fs.statSync(path.join(inDir, f)).mtimeMs })).sort((a, b) => b.time - a.time).slice(0, 1).forEach(e => console.log('Newest input file:', e.f, 'modified at', e.time));
      //fs.readdirSync(outDir).filter(f => /\.(webp)$/i.test(f)).map(f => ({ f, time: fs.statSync(path.join(outDir, f)).mtimeMs })).sort((a, b) => b.time - a.time).slice(0, 1).forEach(e => console.log('Newest output file:', e.f, 'modified at', e.time));

      // Run imagemin.
      imagemin([inDir + '/*.{jpg,png}'], {destination: outDir, plugins: [imageminWebp({quality: q, alphaQuality: q, method: 6 })]});
      console.log(`Converting jpg & png files in ${inDir} to webp in ${outDir} folder.`);
    }
    else {
      console.log(`Files in ${inDir} have been checked and ${outDir} is up-to-date.`);
    }
    // Find orphaned outDir files and moved them to a deleted folder.
    let deletedDir = path.join(inDir, '_deleted'), inFiles = new Set(fs.readdirSync(inDir).filter(f => /\.(png|jpg)$/i.test(f)).map(f => path.parse(f).name));
    fs.readdirSync(outDir).forEach(f => {if (/\.webp$/i.test(f) && !inFiles.has(path.parse(f).name)) {fs.mkdirSync(deletedDir, { recursive: true }); fs.renameSync(path.join(outDir, f), path.join(deletedDir, f))}});
  }

  // Copy SVG files over.
  // Not currently using this, but it may come in handy again sometime.
  /*
  let svgInDir = './src/img/svg', svgOutDir = './img';
  fs.readdirSync(svgInDir).forEach(file => fs.copyFileSync(path.join(svgInDir, file), path.join(svgOutDir, file)));
  */

  done(); // Signal completion
});

gulp.task('minify-css', function () {
  return gulp.src('./src/*.css')
    .pipe(replace('url(../img/', 'url(img/'))
    .pipe(lightningcss({
      minify: true,
      sourceMap: false,
      nesting: false,
      exclude: Features.Nesting,
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./'));
});

gulp.task('strip-js', function () {
  // Removes anything between /* START-DEV */ and /* END-DEV */
  if (!isDev) {
    return gulp.src(['src/afs.js'])
      .pipe(stripCode({
        start_comment: "START-DEV",
        end_comment: "END-DEV"
      }))
      .pipe(concat('afs.strip.js'))
      .pipe(gulp.dest('src/temp'));
  }
  else {
    return gulp.src(['src/afs.js'])
      .pipe(concat('afs.strip.js'))
      .pipe(gulp.dest('src/temp'));
  }
});

gulp.task('prepare-js', function () {
  return gulp.src(['src/temp/afs.strip.js', 'src/afsData.js'])
    .pipe(replace('THIS IS A DEV VERSION OF AFS AND SHOULD NOT BE DEPLOYED!', 'v' + JSON.parse(fs.readFileSync('./package.json')).version)) // Replace dev notice in code with app version.
    .pipe(concat('afs.prep.js'))
    .pipe(replace(' ', '〰️')) // Protect nbsp char.
    .pipe(hypercrush())
    .pipe(replace('〰️', ' ')) // Restore nbsp char.
    .pipe(gulp.dest('./src/temp'));
});

gulp.task('minify-js', function () {
  return gulp.src(['src/temp/afs.prep.js', 'src/temp/svgItems.js'])
    .pipe(concat('afs.min.js'))
    .pipe(terser({ ecma: 7, mangle: { toplevel: true } }))
    .pipe(replace(' ', '〰️')) // Protect nbsp char.
    .pipe(hypercrush('whitespace'))
    .pipe(replace('〰️', ' ')) // Restore nbsp char.
    .pipe(gulp.dest('./'));
});

gulp.task('minify-html', function () {
  var stream;
  if (isDev) {
    stream = gulp.src('./src/*.html')
      .pipe(gulp.dest('./'));
  } else {
    stream = gulp.src('./src/*.html')
      .pipe(replace('src/afs.css', 'afs.min.css'))
      .pipe(replace('<script src="src/afs.js"></script><script src="src/afsData.js"></script><script src="src/temp/svgItems.js"></script><script src="src/dev.js"></script>', '<script src="afs.min.js"></script>'))
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(hypercrush('all'))
      .pipe(gulp.dest('./'));
  }
  return stream;
});

gulp.task('check', function (done) {
  let gzipSize = gzipSizeSync(fs.readFileSync('afs.min.js', {encoding: 'utf-8'}));
  console.log("----------------------");
  console.log('afs.min.js', gzipSize, 'bytes');
  console.log("----------------------");
  let logFile = 'src/temp/gzip-size.log';
  let lastSize = 0;
  if (fs.existsSync(logFile)) {
    let logData = fs.readFileSync(logFile, 'utf8').trim().split('\n');
    let logLine = logData[logData.length - 1].split(' ');
    lastSize = logLine[logLine.length - 2];
  }
  if (gzipSize != lastSize) {
    let date = new Date();
    let formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} `+
      `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    fs.appendFileSync(logFile, `${formattedDate} - ${gzipSize} bytes\n`, 'utf8');
  }
  if (!isDev) {
    console.log("\r\nNOTE: Run 'gulp --dev' to use raw (un-minified) html/js/css for debugging ease.\r\n");
  }
  else {
    console.log("\r\nNOTE: THIS IS A DEVELOPMENT VERSION, RUN WITHOUT --dev PARAM FOR PRODUCTION VERSION.\r\n");
  }
  done(); // Signal completion
});

gulp.task('default', gulp.series(
  gulp.parallel('imagemin', 'svgItems', 'strip-js'),
  'prepare-js',
  gulp.parallel('minify-css', 'minify-js', 'minify-html'),
  'check'
));

gulp.watch(['./src/*'], gulp.series('default'));