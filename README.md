# fp-cs498rk
final project for cs498rk, implementing a web dutch auction system through a MEAN stack web app
<br>
The ```client``` subdirectory contains code for the front end, built in Foundation and AngularJS. The ```server``` subdirectory contains code for the backend, using Mongoose, Express, and Node.js.

To install the components initially, run the following command;
`./install.sh`

To serve the both the front and back end, run the following command:
`./serve.sh`

Running ```./serve.sh``` will launch both Grunt and the Express server on detached screens. To stop serving, simply run ```killall screen```.

You can view the console output of Grunt and Express in ```grunt.log``` and ```server.log``` respectively.