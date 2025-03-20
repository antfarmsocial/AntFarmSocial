# Ant Farm Social

## Developers

If you're fixing bugs, or you're future me finding this and confused about how
to get back into it, here are some tips:

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
- You'll notice aliases used in the JS for common properties and functions,
  this is for the benefit of the terser minifier.  Try to keep up these
  optimisatations by: 1) Being familiar with the existing aliases, and
  2) Keeping an eye on the string analysis in the gulp output for hints
  about inefficiencies.
- You can edit antViewer.html (or create a similar file) to test out
  animations and other ideas.
- Other than that, take your cues from what is already there.
- Prior to releasing code, update the app version by running
  'npm version patch', 'npm version minor' etc.., or modifying the package.json
  because the version is shown in the UI.
- GitHub has an app called "GitHub Desktop" that makes the git stuff easier.
- For graphics and UI design ideas check [this Pinterest board](https://www.pinterest.com.au/braksator/antfarmsocial/)
- If game screws up while developing and you can't restart via the GUI type
  Q() in the console.  This works in production releases too.
- Developer-version browser console cheats (won't work in production release):
  - score(1) [increment score]
  - score(20,1) [20 point bonus]
  - drop('obelisk') [Drop 'obelisk' item - you cannot specify color]
     (note: wait until bag is loaded to use this)
  - save() [Save game after editing vars: _ (game data) or F (current farm)]
     (note: won't work within 30 seconds of loading)
  - SS() [Super speed - farm is dug faster, reload to disable]
  - clone(3) [Clone the first ant in your farm 3 times]
  - spawnAnt() [Increase frequency of free ants appearing]
  - spawner=0 [Disable auto spawning of free ants]
  - testTuns() [Generate a fully built tunnel system]
  - showLines=1 [Show potential joining tunnels coloured by score]
  - getlEl('L').remove() [Clear lines added in showLines=1 mode]
  - director('digStart') [Request ants perform digStart action]
  - act [see a list of all ant actions]
  - stopAnts=1 [Prevent ant actions]
     (note: add this check to things that need to stop)
- Most of these console cheats are available in a GUI when you add
  ?dev=1 to the URL, which is easier when you need to hit it up quickly, but it
  isn't idiot proof and understanding the code is key.
- When publishing a production release; the files listed in .gitattributes do
  not need to be present.
