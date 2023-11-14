// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@account-abstraction/contracts/core/BasePaymaster.sol";

interface IHealthRecordManager {
  function isOwner(address, address) external returns (bool);
}

contract PayManager is BasePaymaster {
  mapping(address sponsor => uint availableBalance) balance;

  IHealthRecordManager private recordManager;

  constructor(IEntryPoint entryPoint) BasePaymaster(entryPoint) Ownable(msg.sender) {}

  function setRecordManager(address rm) external onlyOwner {
    recordManager = IHealthRecordManager(rm);
  }

  function addFund() external payable {
    balance[msg.sender] += msg.value;
  }

  function _validatePaymasterUserOp(
    UserOperation calldata userOp,
    bytes32,
    uint256 maxCost
  ) internal override returns (bytes memory context, uint256 validationData) {
    /**
     * the paymaster data includes the sender's id and the sponsors id
     * the paymaster first verifies that the sender's id belongs to the sender
     */
    (address id, address sponsor) = parsePaymasterData(userOp.paymasterAndData);
    bool s = recordManager.isOwner(id, userOp.sender);
    require(s, "failed");
    require(balance[sponsor] >= maxCost, "insufficient amount");
    balance[sponsor] -= maxCost;
    validationData = _packValidationData(false, uint48(0), uint48(block.timestamp));
    context = "";
  }

  function parsePaymasterData(bytes calldata paymasterData) internal pure returns (address id, address sponsor) {
    (id, sponsor) = abi.decode(paymasterData[20:], (address, address));
  }
}
