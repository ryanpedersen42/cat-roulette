const Pet = artifacts.require("Pet");

module.exports = function(deployer) {
  deployer.deploy(Pet);
};