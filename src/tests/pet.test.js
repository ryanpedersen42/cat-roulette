const Pet = artifacts.require("Pet");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Pet', (accounts) => {
  let pet

  before(async () => {
    pet = await Pet.deployed()
  })

  describe('deployment', async() => {
    it('deploys successfully', async() => {
      const address = pet.address
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
      assert.notEqual(address, 0x0)
      console.log(address)
    })
  })

  describe('storage', async() => {
    it('updates hash', async() => {
      let petHash
      petHash = 'abc123'
      await pet.set(petHash)
      const result = await pet.get()
      assert.equal(result, petHash)
    })
  })
})