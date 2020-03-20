import Web3 from "web3";
import PrivateKeyProvider from "truffle-privatekey-provider";

describe("Loads", () => {
  it("starts loading process", () => {
    cy.visit("http://localhost:3000");

    cy.contains('Hold tight');

  });
});