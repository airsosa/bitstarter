var express = require('express')
var app = express()

var fs = require('fs');
var buffer = fs.readFileSync('index.html');

var output = buffer.toString('utf-8')

app.set('port', (process.env.PORT || 8080))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send(output)
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
