const Promise     = require('bluebird');
const rp          = require('request-promise');
const fakepromise = require('fakepromise');

class SomeModel {

  constructor() {
    this.cachedEntity = {};
  }

  async lookupValue() {
    if (!this.isFresh()) {
      console.log("Rereshing entity...")
      let response = await this.refreshEntity();
      response = this.processResponse(response);
      this.cachedEntity = response; // refresh cache
    } else {
      console.log("Entity from cache...")
    }

    // Async functions automatically wrap return values in a promise
    // so we don't have to do it:
    return this.cachedEntity;
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

  async refreshEntity() {
    const retValue = {};
    retValue.lastFresh = Date.now();
    retValue.value = Math.random() * 700; // 0 - 700
    return fakepromise.promise(200, retValue);
  }
}

async function run() {
  let model = new SomeModel();
  const response1 = await model.lookupValue();
    console.log(response1);
  const response2 = await model.lookupValue();
    console.log(response2)
}
run();
