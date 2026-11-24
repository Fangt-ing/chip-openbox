# Debug workflow

debug.js owns an explicit request/status placeholder. The board control is routed here through openbox.

No debugger connection, inspection, execution control or state modification is implemented. Later supported rebuild/programming requests should invoke those workflows rather than duplicate them.
