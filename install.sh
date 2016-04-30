#!/bin/bash
cd client
npm install
bower install
grunt compass
grunt uglify
cd ..
cd server
npm install
cd ..