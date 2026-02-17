# PRIORITY
- Check code for TODO, ///, console., /* for current tasks.  This may include the CSS file and other files too.

# MINOR BUGS
Here is a list of bugs that have been occasionally observed but were not game-breaking, might be hard to repro, and may have been fixed by virtue of further development.
- Sometimes a second ant appears with the same ID as another, this ant's element can't move.  How did that happen?  Is it because of the dev tools?
- Sometimes an ant does a rotWalk through a non-rotational tunnel, this looks funny but horrible.  There must be a way to detect it without checking tun positions constantly.

# OPTIMIZATION
Optimization ideas that are not too important and would require careful consideration (if worth doing anything about at all).
- The code has to search all the waypoints by calculating their proximity constantly.  It works, but probably won't scale well.  Check code comments for the word 'performance' for ideas.
- A lot of the code to do with waypoints and tunnel walking is split out into short functions that are only called from one place, because they were hard to grok and had an uncertain future.
- We alias a lot of things, this makes the code shorter, but it isn't necessarily good for the final gzipped package.  Frankly that should be the minifier's job to work out, but it doesn't.
- There used to be code that angled prone ants towards the middle when at the end of the tunnel.  Why was that removed?  It was better.

# NEW FEATURE IDEAS
Some ideas for new features that are a bit of a project to build.  They're fun ideas but a lot of work, not crucial, and wouldn't be seen very often.  Additionally the core codebase is a sufficient maintenance burden as it is.
- Diggity Doug - a dig dug playing guy (drop item), farm turns into an arcade game and ants die of heartbreak when player zaps them.  The question is whether the player burrows out new tunnels like dig dug, and the control system would be a whole PITA to build.
- Spider - Appears very rarely (randomised to once every ~24 hours of play when at least 3 farms running), eats free ants, and can be inserted into an ant farm to eat the ants there.  Slowly fills the farm with webs.  Great idea, but since it is supposed to be a rarity is it worth the trouble?
- Gems - Power-ups that are glowing gem items that can drop (at higher scores) that sit on the surface and they do things like; HP regenerator, speeding up ants, autodigger, autofeed.  Would come in different colours (same as paints) one for each power; the glow fx provided by CSS from behind a random transparent PNG.  Not too difficult, but is it too silly and antithetical to the gameplay?
- Scenarios - zombie ant outbreak (fungus caused by gem? look it up a mushroom/flower grows out of their heads).  Army ant invasion (they march in a line and invade the farm wreak havoc and leave, each time getting more ridiculous, they return with guns and then tanks and smash up your farm etc...).  Not really thought through and might be unwanted by players if they encounter it?  Perhaps each gem has a side-effect that causes a scenario for using it once the farm's tunnels are complete.  That way it can be avoided by opting out.
- Colored sand art - Player gets a coupon where they can choose from 10 to 20 random ant farms pre-filled with sand art. Perhaps wooden framed farms to introduce a second variant. But we need a collection of hundreds of designs in a folder.  Flags would be a good set.  Maybe cartoon cels, logos, or custom uploads to be shared with other players coupled with the server idea below.  It would just be a low res blurry jpg and we overlay the sand grain effect?  Hills are a problem though.  And at some point too many possible items means dropping more often at higher scores.
- Multiplayer.  Well now this requires a server with a database, secret password/code you give our friend, public player lookup, chat system.  Connect farms from other players.  View their farms in realtime - which means the updates are not locally calculated but stream from a peer or the server.  Infrastructure$$ and maintenance$$.  It would mean the "social" part of the game's name finally makes sense, but the irony is now gone.  Plus what if there are pervert groomers, who wants to deal with that?

