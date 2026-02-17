# Ant Farm Social

## Developers

If you're fixing bugs, or you're future me finding this and confused about how
to get back into it, here are some tips:

### General

- Start by installing NodeJS on your machine (there is an MSI installer).
- Open repository folder in Visual Studio Code or similar editor.
- Run "npm update" in the command line terminal.
- DON'T EVER edit "/index.html", "/afs.min.js", or "/afs.min.css"!
- Instead edit in /src and generate root dir files by running the command "gulp",
  or alternatively "gulp --dev" which is easier for debugging.  Just remember
  to remove the --dev flag and run gulp again when you're done coding.
- Gulp will then wait and watch for changes in the /src
  directory as long as it is left running.  You should read the gulpfile
  so that you are aware of some of the quirks in this project.
- If you create new css/js/html files, you'll need to study the gulpfile
  to figure out where to properly handle that.  Quit and restart gulp to test!
- You can edit antViewer.html (or create a similar file) to test out
  animations and other ideas.
- Other than that, take your cues from what is already there.
- Prior to releasing code, update the app version by running
  'npm version patch', 'npm version minor' etc.., or modifying the package.json
  because the version is shown in the UI.
- GitHub has an app called "GitHub Desktop" that makes the git stuff easier.
- When publishing a production release; the files listed in .gitattributes need
  not be present.  Github will do this automatically.
- Be aware that even minor additions such as a new type of item drop or ant
  behaviour can be a laborious process that requires a lot of asset preparation and
  careful consideration.  Many ideas going into this project have been ditched
  as even the MVP features (to make the game winnable) have considerable scope.
  Check TODO.md for some ideas that have survived but are just not implemented.

### Developer Cheats

- If game screws up while developing and you can't restart via the GUI type
  Q() in the console.  This works in production releases too.
- When in dev mode any function can be called or global changed via the browser's console.
- Many of the functions are available in a GUI when you add
  ?dev=1 to the URL, which is easier when you need to hit it up quickly, but it
  isn't idiot proof and understanding the code is key.  Add to dev.js as needed.

### Images and Audio

- For graphics and UI design ideas check [this Pinterest board](https://www.pinterest.com.au/braksator/antfarmsocial).
  This also contains reference images (where potentially useful) from the original design of the UI.
- The first goal should always be to avoid using images or external files for anything; use HTML/CSS/ASCII as much as you can push it.
  Sometimes that works out better.
- PSD/AI resources are NOT kept in the git repo, but are retained offline.
- General rule for images is to make them at least twice the resolution that they'll be displayed (look up "@2x retina assets").
  However, images used in the background (out of focus) are quite a low resolution and highly compressed.
- The process for making game graphics is ideally to make them as a vector first.  First step is to create a raster design in photoshop based
  on reference images, and cleaning it up as much as possible.  Then in illustrator either manually trace the design or for more
  complicated images use the Image Trace functionality and create an image with reduced complexity.  Sometimes you can get away with just
  reducing the amount of colours in photoshop to make it look like game graphics.  Then create JPG (or PNG for transparency)
  files from it typically with a maximum longest dimension of 512px, or 256px for "stickers".  Very small/simple (non-bag) GUI images and/or dynamically coloured
  item images must be saved as SVG v1.1 with CSS Properties set to Presentation Attributes.
- Small SVG files that are part of the GUI (other than bag/drop images) can be inserted directly into HTML/JS code, but should be compressed
  as described here, and further crushed using [HyperCrush](https://braksator.github.io/hypercrush).
- SVG item (scene and paint) files should be compressed with an online tool first [vecta.io nano](https://vecta.io/nano), unless the result conflicts with
 `JCrush SVG` in which case try [iLoveImg](https://www.iloveimg.com/compress-image) or another tool.
- SVG item (scene and paint) images in ./src/img/items are converted to dynamic SVG code in ./src/svgItems.js.  The images must be 2 colours, the main
  colour being #64bc41 and the other being an overlayed dark-grey (not #000000!) at 25% opacity.  The exception being files with
  names containing the word 'paint', or the 'ants' file, where only the main color (#64bc41) is dynamic.
  The files are to be saved as SVG v1.1, with Presentation Attributes instead of
  CSS.  They should reprocess if a new file is added, or the svgItems.js is deleted, when gulp is run.
- Take care with size of image files kept with the project; use a PNG crush like [TinyPng](https://tinypng.com) on all new PNG (PNG8!) files, and reduce
  quality/size of new JPGs as much as acceptable.  Store them in /src/img and the gulpfile will do a webp
  conversion and put them into the /img dir.
- GIF files are manipulated and compressed slightly using the tools at [Ezgif](https://ezgif.com/optimize), stored in /src/img/gif,
  and then converted manually with [Ezgif GIF to WebP](https://ezgif.com/gif-to-webp) and put in /img/gif.  Retain uncompressed and source
  files offline.
- Audio is converted to Opus 64kb mono using [Convertio](https://convertio.co/ogg-opus).  Higher quality versions
  of the audio files are retained in /src/audio in case they need to be recreated.

### Code Compression

Since this app uses a lot of resources every opportunity is taken to reduce sizes of files served to the end user.

- Code brevity and density should always be a priority unless run-time performance is unacceptable.  Readability will come naturally as developer
  becomes familiar with terse syntax.  Always be open to refactoring opportunities.
- This does not mean excessively removing whitespace in js code or shortening variable names as that is handled by minification.  This is only done
  as far as to comfortably fit more code onto the screen when browsing it.  No formalised style guide; take cues from existing code.
- It also does not mean compromising when it comes to text content for display to the player.
- However anything that makes it to the final output should be short, such as object keys and CSS class names, at least as much as can be reasonably
  understood for the sake of development.  There is no minification employed for these things and they perhaps could use improvement.
- Gulp reports a gzip size for the combined & minified js file which can help evaluate the effectiveness of refactoring.  A log of these reports is
  generated too so you can track progress. Results often reveal efforts are counter-intuitive as "Gzip hates your DRY code".
- Gulpfile uses dev dependencies to minify JS/CSS/HTML (as is normally done for web projects).
- HTML files and HTML in Javascript strings get squeezed in gulp tasks using [HyperCrush](https://www.npmjs.com/package/hypercrush)
- Note: `JCrush SVG`, and `HyperCrush` were developed specifically for this app.

