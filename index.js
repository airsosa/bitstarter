var express = require('express')
var app = express()

var fs = require('fs');
var buffer = fs.readFileSync('index.html');

var string = buffer.toString('utf-8')

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send(string)
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
