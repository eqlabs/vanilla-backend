"use strict";

const sinon = require("sinon");
const expect = require("chai").expect;

const { createTestDBConnection } = require("../utils/testing");
const { makeTemplateModel } = require("./");

describe("makeTemplateModel", function() {
  let dbConnection;

  before(() => {
    dbConnection = createTestDBConnection();
  });

  beforeEach(() => {
    sinon.spy(dbConnection, "model");
  });

  afterEach(() => {
    dbConnection.model.restore();
  });

  after(() => {
    dbConnection.close();
  });

  it("should be able to init the model", async function() {
    const model = await makeTemplateModel(dbConnection);
    expect(dbConnection.model.callCount).to.be.above(0);
    expect(typeof model.find).to.equal("function");
  });
});

describe("Template schema", function() {});
