Production meeting...

# PRIORITY
- Check code for TODO, ///, console., /* for current tasks.  This may include the CSS file and other files too.

# MINOR BUGS
Here is a list of bugs that have been occasionally observed but were not game-breaking, might be hard to repro, and may have been fixed by virtue of further development.
- Created a level system for stacking eggs and infants, but have never witnessed that this actually does anything?
- When carried items (esp infs/eggs) are dropped on the surface level, zero consideration is given to what they are dropped next to or on top of (food/drink/entrances/infants/eggs). Placement inside vials also does not check if they are infront of one another, but I think that's the same with the ants themselves - cramped space so not worth trying to spread them out.  Maybe none of this really matters.
- When an ant goes from side->prone pose in a 'con' it does an awkard sideways slide as (possibly part of a rotWalk) to align with the next tunnel instead of just marching ahead to the next tunnel.
- Rare bug: Hitting "test tuns" in dev, all tunnels have a y-value that puts them above the farm, looks like it is 510px (surface value) less that it is supposed to be.  Ant spill detector code doesn't detect this situation either.  Further investigation shows that calling dumpFarm(0), dumpFarm(1), and then using a fill item, calling startFarm(1), or hitting "test tuns" again produces some rather horrible results.   Perhaps some hardening to these functions is required.  Possible something doesn't get reset properly.  This is possibly caused by tunnel deletions not being handled properly - removal of references from other tuns .co and .c values!  POSSIBLY FIXED NOW!
- Dumping a farm can cause some console errors due to long running actions.


# OPTIMIZATION
Optimization ideas that are not too important and would require careful consideration (if worth doing anything about at all).
*none*

# NEW FEATURE IDEAS
Some ideas for new features that are a bit of a project to build.  They're fun ideas but a lot of work, not crucial, and wouldn't be seen very often.  Additionally the core codebase is a sufficient maintenance burden as it is.
- Diggity Doug - a dig dug playing guy (drop item), farm turns into an arcade game and ants die of heartbreak when player zaps them.  The question is whether the player burrows out new tunnels like dig dug, and the control system would be a whole PITA to build.
- Spider - Appears very rarely (randomised to once every ~24 hours of play when at least 3 farms running), eats free ants, and can be inserted into an ant farm to eat the ants there.  Slowly fills the farm with webs.  Great idea, but since it is supposed to be a rarity is it worth the trouble?
- Gems - Power-ups that are glowing gem items that can drop (at higher scores) that sit on the surface and they do things like; HP regenerator, speeding up ants, autodigger, autofeed, evacuate to nip, egg/infant speedups.  Would come in different colours (same as paints) one for each power (design ideas at pinterest.com/pin/9499849210697831 pinterest.com/pin/9499849210697871).  Not too difficult, but is it too silly and antithetical to the gameplay?
- Scenarios - zombie ant outbreak (fungus caused by gem? look it up a mushroom/flower grows out of their heads).  Army ant invasion (they march in a line and invade the farm wreak havoc and leave, each time getting more ridiculous, they return with guns and then tanks and smash up your farm etc...).  Not really thought through and might be unwanted by players if they encounter it?  Perhaps each gem has a side-effect, like a curse, that causes a scenario for using it once the farm's tunnels are complete.  That way it can be avoided by opting out.  Could give the gems names like "Cursed Crystal of Urgency" or the "Doomed Gems of Excavation", idk use a thesaurus to come up with variants.
- Borax/Ant-Rid - Poison food to wipe out a nest, but it is a half-baked idea needs more of a reason to exist.  Ant-baits/repellent could be used to prevent free ants running on the screen, if someone finds that annoying? Those could be tucked in behind the farm between the nips or in the bottom corner.
- Colored sand art - Player gets a coupon where they can choose from 10 to 20 random ant farms pre-filled with sand art. Perhaps wooden framed farms to introduce a second variant. But we need a collection of hundreds of designs in a folder.  Flags would be a good set.  Maybe cartoon cels, logos, or custom uploads to be shared with other players coupled with the server idea below.  It would just be a low res blurry jpg and we overlay the sand grain effect?  Hills are a problem though.  And at some point too many possible items means dropping more often at higher scores.
- Multiplayer.  Well now this requires a server with a database, secret password/code you give your friend, public player lookup, chat system.  Connect farms from other players.  View their farms in realtime - which means the updates are not locally calculated but stream from a peer or the server.  Infrastructure$$ and maintenance$$.  It would mean the "social" part of the game's name finally makes sense, but the irony is now gone.  Plus what if there are perverts, who wants to deal with that?
- Drone ants are useless, and are rigged to eventually be constantly at low hp so they die, but we should probably allow them to escape at any chance they get: i.e. they are inclined to hang around 'top' and 'bg' and fly away when the lid is off.

