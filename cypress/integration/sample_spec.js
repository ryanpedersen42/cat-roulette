import Web3 from "web3";
import PrivateKeyProvider from "truffle-privatekey-provider";

describe("Auths", () => {
  it("I can increment number of clicks", () => {
    cy.on("window:before:load", (win) => {
      const provider = new PrivateKeyProvider(
        "insert private key...",
        "https://rinkeby.infura.io/"
      );
      win.web3 = new Web3(provider);
    });



    cy.visit("http://localhost:3000");

    cy.wait(10000);

  });
});