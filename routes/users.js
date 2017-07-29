const router = require('express').Router();
const db = require('../db.js');

router.post('/', function(req, res){
  db.createUser(req.body.name, req.body.isManager)
  .then(function(){
    res.redirect('/users');
  })
});

router.get('/', function(req, res){
  db.getUsers(false)
  .then(function(users){
    db.getUsers(true)
    .then(function(managers){
      res.render('users', {
        showUsers: true,
        users: users,
        namesLength: users.length,
        managersLength: managers.length,
      })
    })
  })
  .catch(function(err){
    console.log(err);
  })
});

router.put('/:id', function(req, res){
  db.updateUser(req.params.id * 1)
  .then(function(result){
    if (result === 'toManager'){
      res.redirect('/users/managers');
    }
    else {
      res.redirect('/users');
    }
  })
  .catch(function(err){
    console.log(err);
  })
})

router.get('/managers', function(req, res){
  db.getUsers(false)
  .then(function(users){
    db.getUsers(true)
    .then(function(managers){
      res.render('managers', {
        showManagers: true,
        managers: managers,
        namesLength: users.length,
        managersLength: managers.length,
      })
    })
  })
  .catch(function(err){
    console.log(err);
  })
})

router.delete('/:id', function(req, res){
  db.deleteUser(req.params.id * 1)
  .then(function(){
    res.redirect('/users');
  })
})

module.exports = router;
