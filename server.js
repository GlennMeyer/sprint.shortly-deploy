var app = require('./server-config.js');

/* START SOLUTION */
var port = process.env.PORT || 4568;
/* ELSE
var port = 4568;
END SOLUTION */

app.listen(port);

console.log('Server now listening on port ' + port);
