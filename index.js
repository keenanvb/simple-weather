var express = require('express');

var app = express();

//use static folders 
app.use(express.static('public'));


app.get('/',function(req,res){
  res.render('index');
});


var server = app.listen(3000,function(){
    console.log("Listening to port 3000");
});
