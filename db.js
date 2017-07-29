const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
const Promise = require('bluebird');

function sync() {
  var sql = `
    DROP TABLE IF EXISTS users;

    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name TEXT DEFAULT NULL,
      manager BOOLEAN DEFAULT FALSE
    );

    INSERT INTO users (name, manager) VALUES ('Tim', TRUE);
    INSERT INTO users (name, manager) VALUES ('Peggy', TRUE);
    INSERT INTO users (name, manager) VALUES ('Tom Hanks', FALSE);
  `;

  return promiseQuery(sql);

}

function promiseQuery(sql, params) {
  return new Promise(function(resolve, reject){
    client.query(sql, params, function(err, result){
      if (err) {return reject(err);}
      else {
        resolve(result);
      }
    });
  });
}

function getUsers(managerOnly) {
  if (!managerOnly) {
    return promiseQuery(`select * from users;`)
    .then(function(result){
      return result.rows;
    })
    .catch(function(err){
      console.log(err);
    })
  }
  else {
    return promiseQuery(`select * from users where manager = true;`)
    .then(function(result){
      return result.rows;
    })
    .catch(function(err){
      console.log(err);
    })
  }
}

function getUser(id) {
  return promiseQuery(`select name from users where id = $1`, [id])
  .then(function(result){
    return result.rows[0].name;
  })
  .catch(function(err){
    console.log(err);
  });
}

function createUser(user, isManager) {

  if (user === '') {
    throw new Error('Need a name!');
  }

  if (isManager === undefined){
    return promiseQuery(`insert into users (name) values ($1)`, [user])
    .then(function(result){
      return result;
    })
    .catch(function(err){
      console.log(err);
    })
  }
  else {
     return promiseQuery(`insert into users (name, manager) values ($1, true)`, [user])
    .then(function(result){
      return result;
    })
    .catch(function(err){
      console.log(err);
    })
  }
}

function updateUser(id) {
  return promiseQuery(`select manager from users where id = $1`, [id])
  .then(function(result){
    if (result.rows[0].manager) {
      promiseQuery(`update users set manager = false where id = $1`, [id]);
      return 'toUser';
    }
    else {
      promiseQuery(`update users set manager = true where id = $1`, [id]);
      return 'toManager';
    }
  })
  .catch(function(err){
    console.log(err);
  })
}

function deleteUser(id) {
  return promiseQuery(`delete from users where id = $1`, [id])
  .then(function(result){
    return result;
  })
  .catch(function(err){
    console.log(err);
  })
}

client.connect(function(){
  console.log('database connected');
});

module.exports = {
  sync: sync,
  getUsers: getUsers,
  getUser: getUser,
  createUser: createUser,
  updateUser: updateUser,
  deleteUser: deleteUser
};
