const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./db.js');
const nunjucks = require('nunjucks');
const path = require('path');
const router = require('./routes/users.js')
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

nunjucks.configure('views', {noCache: true})
app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));

app.set('view engine', 'html');
app.engine('html', nunjucks.render);

app.use('/users', router);

app.get('/', function(req, res){
  db.getUsers(false)
  .then(function(names){
    return names.length;
  })
  .then(function(namesLength){
    db.getUsers(true)
    .then(function(managers){
      res.render('index', {
        showHome: true,
        namesLength: namesLength,
        managersLength: managers.length
      })
    })
  })
  .catch(function(err){
    console.log(err);
  })
})

app.use(function(err, req, res, next){
  db.getUsers(false)
  .then(function(names){
    return names.length;
  })
  .then(function(namesLength){
    db.getUsers(true)
    .then(function(managers){
      res.render('error', {
        error: err,
        showUsers: true,
        namesLength: namesLength,
        managersLength: managers.length
      })
    })
  })
  .catch(function(er){
    console.log(er);
  })
});

app.listen(port, function(){
  console.log(`listening on PORT ${port}`);
  db.sync()
});

