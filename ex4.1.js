const Promise = require("bluebird");

function someAsyncFunction(userId) {

  return new Promise((resolve, reject) => {

    lookupUser(userId).then((user) => {
      let something = user.something;
      // some more calculations
      let newUserObj = transform(something, user);

      checkCondition(newUserObj).then((transformedUser) => {
        if (!transformedUser.passed) {
          reject(new Error("Didn't pass the condition!"));
        }

        saveToDatabase(transformedUser).then((result) => {
          if (verifyDbResult(result)) {
            resolve(result);
          } else {
            reject(new Error("Database malfunction"));
          }
        }).catch(err => {
          reject(err);
        });
      }).catch(err => {
        reject(err);
      });
    }).catch(err => {
      reject(err);
    });
  });
}

// Executing our test function:

someAsyncFunction("7fd12fd1-a977-4ace").then(result => {
  console.log("SUCCESS: ");
  console.log(result);
}).catch(err => {
  console.error(err.message);
  console.log("Please try again.");
});

//-- Faking-out support functions that are not essential:

function lookupUser(userId) {
  let user = {};
  user.id = userId;
  user.something = "somethingProp";
  return fakeAsyncPromise(1, user);
}

function transform(something, user) {
  user.something = `was: ${something}`;
  user.converted = "9ac0758a-05fd-44c5-b6db-adccddd2d40b";
  return user;
}

function checkCondition(user) {
  let passed = getRandomFromRange(0, 3);
  // 2/3 chance of passing:
  passed = passed > 1 ? true : false;
  user.passed = passed;
  return fakeAsyncPromise(1, user);
}

function saveToDatabase(user) {
  let errorRate = getRandomFromRange(0, 3);
  // 1/3 chance of erroring-out:
  errored = errorRate < 1 ? true : false;
  
  if (!errored) {
    user.source = 'from-database';
  }
  
  return fakeAsyncPromise(2, user);
}

function verifyDbResult(user) {
  return user.source === "from-database";
}

function getRandomFromRange(min, max) {
  return Math.random() * (max - min) + min;
}

function fakeAsyncPromise(delaySecsUpTo, passValue) {
  let delay = getRandomFromRange(0, delaySecsUpTo) * 1000;
  return new Promise((resolve) => {
    setTimeout((passValueArg) => {
      resolve(passValueArg);
    }, delay, passValue);
  });
}