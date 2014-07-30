replay
======

A react.js replayable UI.

This demonstrates capturing and replaying state frames in a react.js application without 
asynchronous side effects. One could imagine using this as a debug tool.  Saving each 
frame and adding them to a bug report.  For the developer reproducing state would be 
simply re-running the frames.  No need for any complicated server state reproduction.

You can load index.html directly in your browser.

## Rules

All state updates flow through updateState()

## Caveats 

There are no actual async calls in this code.

Saving and reloading frames is not implemented.
