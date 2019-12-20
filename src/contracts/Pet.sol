pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Pet {
    string[] petHashes;

    function addPetHash(string memory _petHash) public {
        string memory toPost = _petHash;
        petHashes.push(toPost);
    }

      function getHashes() public view returns(string[] memory) {
      return petHashes;
  }
}