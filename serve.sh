#!/bin/bash
killall screen
screen -d -m -S bukkit bash -c 'cd server; nodemon -L server.js'
screen -d -m -S bukkit bash -c 'cd client; grunt'
echo "Launching Grunt and Express server..."
/bin/sleep 6
echo "Grunt and Express are up and running!"