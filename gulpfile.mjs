import gulp from 'gulp';
import terser from 'gulp-terser';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import replace from 'gulp-replace';
import concat from 'gulp-concat';
import htmlmin from 'gulp-htmlmin';
import fs from 'fs';

var analyzeStrings = true;
var isDev = process.argv.includes('--dev');

// This function ensures we're only showing results that aren't always surrounded by whitespace like regular words.
// Unfortunately this is only effective some of the time.
function checkWordBoundary(text, string) {
  // Create regex pattern to find the word with non-whitespace char before or after
  const pattern = new RegExp(`[^a-zA-Z0-9\\s\n]${string}|\\n${string}`, 'g');
  // Search for the pattern in the text
  const match = text.match(pattern);
  // Return true if match found, otherwise false
  return !!match;
}

// Finds repeated words in a piece of text.
function findRepeatedSubstrings(text, maxResults = 100, minLength = 4, maxLength = 30, minOccurences = 3, omit = []) {
  const cleanedText = text.replace(/[^\w]/g, ' '); // Replace non-word characters with spaces
  const words = cleanedText.split(/\s+/); // Split text into words
  let substrings = {};
  // Iterate over the words to count full words within the length range
  for (let word of words) {
    if (word.length >= minLength && word.length <= maxLength) {
      if (!substrings[word]) {
        substrings[word] = 0;
      }
      substrings[word]++;
    }
  }
  // Filter and map substrings to the format { substring, count, score }
  let results = Object.keys(substrings)
    .filter(substring => substrings[substring] >= minOccurences && checkWordBoundary(text, substring) && !omit.includes(substring.toLowerCase()))
    .map(substring => ({
      substring: substring,
      count: substrings[substring],
      score: Math.max(1, (substring.length - 3)) * Math.max(1, substrings[substring] - 1)
    }));
  // Sort results by score in descending order
  results.sort((a, b) => b.score - a.score);
  // Remove substrings of already included results
  let filteredResults = [];
  let seen = new Set();
  for (let result of results) {
    if (![...seen].some(s => s.includes(result.substring))) {
      filteredResults.push(result);
      seen.add(result.substring);
    }
  }
  // Return the top maxResults
  return filteredResults.slice(0, maxResults);
}

// Searches source files for repeated words and assembles a report to display in the terminal.
// Words listed earlier in the report list have more potential for optimisation.
function analyzeString(omit = []) {
  // Do it.
  var files = ['./afs.min.js', './afs.min.css', './index.html'];
  for (var f = 0; f < files.length; f++) {
    var text = fs.readFileSync(files[f], { encoding: 'utf8', flag: 'r' });
    let res = [];
    // Use an iterative approach, explicitly collecting results with long words.
    // This ensures frequent short words don't push longer words off the list entirely.
    let minWordSize = 4, times = 6;
    for (var len = minWordSize * times; len >= minWordSize; len -= minWordSize) {
      var result = findRepeatedSubstrings(text, 50, len, 30, 3, omit);
      res = res.concat(result);
    }
    res.sort((a, b) => b.score - a.score);
    let output = [];
    for (var i = 0; i < res.length; i++) {
      output.push(res[i].substring + " (" + res[i].count + "x)");
    }
    output = Array.from(new Set(output));
    var out = '\r\nAnalysis of repeated strings in "' + files[f] + '": ' + output.join(', ');
    console.log(out);
  }
  console.log(' ');
}

gulp.task('analyze', function (done) {
  let omit = [
    // This is a list of words that we just accept we've used a lot in the content, and we don't need to see them appear in repeated-strings reports. (supply all with lower-case)
    'colony', 'because', 'consciousness', 'every', 'about', 'what', 'enlightenment', 'ephemeral', 'watching', 'observing', 'contributes', 'communication', 'congrats', 'congratulations',
    'prompting', 'creating', 'inspires', 'bringing', 'appreciating', 'encouraging', 'impressive', 'suggesting', 'realizing', 'uplifting', 'illusion', 'reflects', 'teaching', 'building',
    'artesano', 'gangster', 'another', 'that', 'inspiring', 
  ];
  if (analyzeStrings) {
    analyzeString(omit);
    analyzeStrings = 0;
  }
  setTimeout(() => {analyzeStrings = 1}, 1000 * 60 * 60); // Only run once an hour.
  done(); // Signal completion
});

gulp.task('minify-css', function () {
  return gulp.src('./src/*.css')
    .pipe(replace('url(../img/', 'url(./img/'))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./'));
});

gulp.task('minify-js', function () {
  return gulp.src('./src/afs*.js')
    .pipe(replace('THIS IS A DEV VERSION OF AFS AND SHOULD NOT BE PUBLISHED!', 'v' + JSON.parse(fs.readFileSync('./package.json')).version)) // Replace dev notice in code with app version.
    .pipe(concat('afs.min.js'))
    .pipe(terser({ ecma: 7, mangle: { toplevel: true, reserved: ['dev'] } }))
    
    // Remove whitespace (even in strings) - Can't figure out how to do this with terser().
    // These will create a bit of a "gotcha" in templating, as we can't rely on whitespace between two tags to create a space.
    .pipe(replace(`\\n`, '')) // Remove all newlines, even from strings.
    .pipe(replace(`\\t`, '')) // Remove all tabs, even from strings.
    .pipe(replace(`\\r`, '')) // Remove all returns, even from strings.
    .pipe(replace('    ', ' ')) // Replace 4-spaces with one space.
    .pipe(replace('   ', ' ')) // Replace 3-spaces with one space.
    .pipe(replace('  ', ' ')) // Replace 2-spaces with one space.
    .pipe(replace('> <', '><')) // Remove spaces between tags.

    .pipe(gulp.dest('./'));
});

gulp.task('minify-html', function () {
  var stream;
  if (isDev) {
    stream = gulp.src('./src/*.html')
      .pipe(gulp.dest('./'));
  } else {    
    stream = gulp.src('./src/*.html')
      .pipe(replace('./src/afs.css', 'afs.min.css'))
      .pipe(replace('<script src="./src/afsItems.js"></script><script src="./src/afsData.js"></script><script src="./src/afs.js"></script><script src="./src/dev.js"></script>', '<script src="afs.min.js"></script>'))
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest('./'));
  }
  return stream;
});

gulp.task('check-version', function (done) {
  if (!isDev) {
    console.log("\r\nNOTE: Run 'gulp --dev' to use raw (un-minified) html/js/css for debugging ease.\r\n");
  }
  else {
    console.log("\r\nNOTE: THIS IS A DEVELOPMENT VERSION, RUN WITHOUT --dev PARAM FOR PRODUCTION VERSION.\r\n");
  }
  done(); // Signal completion
});

gulp.task('default', gulp.series(
  gulp.parallel('minify-css', 'minify-js', 'minify-html'),
  'analyze',
  'check-version'
));

gulp.watch(['./src/*'], gulp.series('default'));