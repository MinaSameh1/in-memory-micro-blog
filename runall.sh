#!/bin/bash

tmux new-session -d -s "runall" \
  "fish -c 'cd client && yarn start; exec fish'" \; \
  rename-window "client" \; \
  split-window -v "cd client; exec fish" \; \
  new-window -n "comments" "fish -c 'cd comments && yarn dev; exec fish'" \; \
  split-window -v "cd comments; exec fish" \; \
  new-window -n "events" "fish -c 'cd events && yarn dev; exec fish'" \; \
  split-window -v "cd events; exec fish" \; \
  new-window -n "moderation" "fish -c 'cd moderation && yarn dev; exec fish'" \; \
  split-window -v "cd moderation; exec fish" \; \
  new-window -n "posts" "fish -c 'cd posts && yarn dev; exec fish'" \; \
  split-window -v "cd posts; exec fish" \; \
  new-window -n "query" "fish -c 'cd query && yarn dev; exec fish'" \; \
  split-window -v "cd query; exec fish" \; \
  set-option -t runall remain-on-exit on

# tmux attach-session -t "runall"
