# IMPORTANT FEATURES @TODO
- a stat to do with hatting ants?
- Queen handling and reproduction
- Test tube thing to put your existing ants into the inventory.
- Ants need to poop
- If an ant has to eat the same food source 3 times in a row it will get unhappy.
- Certain ants must have access to sweet foods to be happy, certain ants must have access to meats to be happy.  they can all survive on both.
- Implement the new fillers (ooze, slime, beer, etc...) + add a clearish-yellow filler called Expired Bulk Personal Lubricant (this fkn town...  Attracts queens and better for breeding. ) 
- Draggable bag items; https://stackoverflow.com/questions/74335612/drag-and-drop-when-using-flex-wrap
- Check code for @TODO and console.log for further urgent tasks.
- Drone ants +wings, bodies must look slightly different? drop wings after mating (NOT FINDABLE - ONLY HATCH), then they deplete health faster and their max health is capped lower and lower each time they rest until they die.


# JOKES
- make references to urbandictionary terms containing "... the farm", "ants", etc...
- puns about famous guys named anthony, antimony, other words containing 'ant', phrases using "ain't"/"and"...
- sea sh-antys
- Lady Antebellum
- End of game redirect: https://youtu.be/MNgJBIx-hK8
- lifting the lid: check your openings for papers - sweat house something something - they're always open ???


# ACHIEVEMENTS
- achievements get you a drop, and 5 points. (bypass regular scoring system.)
- Starting a new ant farm gets you 20 points (bypass regular scoring system.)


# NEW FEATURE IDEAS ???
- an idle player detector - tumbleweeds (see inspiration folder) and insulting remarks "take a chance you stupid ho" (gwen stefani) etc...
- liquid metal to pour into nest, destroys ants and farm leaving behind only the sculpture.
- ant baits, pellets and gels to kill ants. - lay them inside the top or just inside one of the connectors.
- barriers - small line, long line, long curved line, quarter circle (sm and lg), ants cannot dig or cross through barriers (but farm has to be empty)
- diggity doug - a dig dug playing ant guy, game turns into an arcade game and ants die of heartbreak.
- change to throw at enemy ant squads
- enemy ant invasion scenario - lines of free ants, or ants from a connected farm can stage an invasion.
- army ants, they get stronger each attack, eventually showing up in tanks.  Then there's air force ants too.  They irreperably damage your ant farm.
- Zombie ant outbreak.
- new ant farm rare variants: aluminium, clear plastic (depends how much fudging and cheating goes on behind the frame), timber (see inspo folder).
- use power-ups to increase your own ants max stats (.e.g health can go higher than 100), or strength boosters.
- multiplayer: Connect your farm to a server, and pick another player/group.  Tube-connect your farms.  Item trading.  Observe their farm (but can't change anything).
- If no food available, but tube available - higher chance to traverse tube.
- When ants are digging in dirt they can come across treasures like gemstones or gold which get sent up into the bag, when used they give a bonus or another drop or something.

# NEW ANT IDEAS ???
- leafcutter ants cultivate fungi in their chambers -- why?
- carpenter, sugar, chimera, fancy, pharaoh, adam (second array that unlocks at certain levels) - purchasable/dropped queen ants (not free)

# OPTIMISATION
- What classes and ids are created in html/templates and added with javascript that are never actually used for anything?
- What CSS rules have redundant selectors "e.g. #foo .foo-item" when ".foo-item" exists nowhere else.
- Recheck what aliases we have forgotten to use (length, Math., etc...)
- link, menu, button styles could be better organised and have redundant/unneeded styles -- why use a combo of link/button styles? why use '>' in the selectors.
- A bunch of modal related functions have arguments passed in that are not needed.

# MINOR BUGS
- Large ant rears overlap their near-side legs
- Some entrances don't go anywhere.  Either we need to force a "bad" connection somehow (dummy tunnel for looks? one way tunnel?) or create a stub dead-end system, perhaps to a small cav.
- Ants often stand in the exact same spot as other ants, we need a way to discourage this.
- Sometimes tunnels still overlaps, test with testTuns() to see.  It would be possible to move tuns around a little after everything is connected to fix this, but there might be a bug in the existing doTunnelsIntersect usage that is failing to avoid this?

