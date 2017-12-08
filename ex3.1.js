const Promise     = require('bluebird');
const rp          = require('request-promise');
const fakepromise = require('fakepromise');

class SomeModel {

  constructor() {
    this.cachedEntity = {};
  }

  lookupValue() {
    let waitForRefresh;
    if (!this.isFresh()) {
      console.log("Rereshing entity...")
      waitForRefresh = this.refreshEntity();
    } else {
      console.log("Entity from cache...")
      // Fake wait, creates a fulfilled promise:
      waitForRefresh = Promise.resolve(this.cachedEntity);
    }

    return new Promise((resolve, reject) => {
      waitForRefresh.then((response) => {
        response = this.processResponse(response);
        this.cachedEntity = response; // refresh cache
        resolve(response);
      }).catch((err) => {
        reject(err);
      });
    })
  }

  isFresh() {
    if (!this.cachedEntity.lastFresh) {
      return false;
    }

    // or if older than 5 secs - consider not-fresh
    if ((Date.now() - this.cachedEntity.lastFresh) > 5000) {
      return false;
    }

    return true;
  }

  processResponse(response) {
    response.processed = true;
    return response;
  }

  refreshEntity() {
    const retValue = {};
    retValue.lastFresh = Date.now();
    retValue.value = Math.random() * 700; // 0 - 700
    return fakepromise.promise(200, retValue);
  }
}

let model = new SomeModel();
model.lookupValue().then(response1 => {
  console.log(response1);
  return model.lookupValue();
}).then(response2 => {
  console.log(response2)
});
