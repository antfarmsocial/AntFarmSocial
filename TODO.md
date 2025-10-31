# IMPORTANT FEATURES @TODO
- Check code for @TODO, ///, console.log for further urgent tasks.  This includes the CSS file too.

# MINOR BUGS
- Audio loops, such as with the crucible item do not play seamlessly?  I believe the way to disguise it is to have two audios playing with a time offset.
- Sometimes (very rarely) there are unconnected cavities, this will cause F.dun to fail.  Why aren't they connected?  It seems the problem is in data they are connected by a tun with .w set to '0'! Why?

# NEW FEATURE IDEAS?
Some ideas for new features that are a bit of a project to build.  They're fun ideas but a lot of work, not crucial, and wouldn't be seen very often.  Additionally the core codebase is a sufficient maintenance burden as it is.
- Diggity Doug - a dig dug playing guy, farm turns into an arcade game and ants die of heartbreak when player zaps them.  The question is whether the player burrows out new tunnels like dig dug, and the control system would be a whole PITA to build.
- Spider - Appears very rarely (randomised to about ~24 hours of play when at least 3 farms running), eats free ants, and can be inserted into an ant farm to eat the ants there.  Slowly fills the farm with webs.  Great idea, but since it is supposed to be a rarity is it worth the trouble?
- Gems - Power-ups that are glowing gem items that can drop (at higher scores) that sit on the surface and they do things like; HP regenerator, speeding up ants, autodigger, autofeed.  Would come in different colours; the glow fx provided by CSS from behind a random transparent PNG.  Not too difficult, but is it too silly and antithetical to the gameplay?
- Scenarios - zombie ant outbreak, enemy ant invasion, etc...  Not really thought through and might be unwanted by players if they encounter it?

