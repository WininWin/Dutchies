#!/bin/bash
cd client
npm install
bower install
bower install angular-credit-cards
grunt compass
grunt uglify
cd ..
cd server
npm install
cd ..