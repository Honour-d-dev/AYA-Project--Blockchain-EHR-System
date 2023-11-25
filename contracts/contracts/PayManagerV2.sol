// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@account-abstraction/contracts/core/BasePaymaster.sol";

contract PayManager is BasePaymaster {
  mapping(address sponsor => uint availableBalance) balance;

  address private healthRecordManager;

  constructor(IEntryPoint entryPoint) BasePaymaster(entryPoint) Ownable(msg.sender) {}

  function setRecordManager(address rm) external onlyOwner {
    healthRecordManager = rm;
  }

  function addFund() external payable {
    balance[msg.sender] += msg.value;
    deposit();
  }

  //for Testing purposes only
  function removeFunds() external {
    (bool s, ) = owner().call{value: address(this).balance}("");
    require(s, "");
    withdrawTo(payable(owner()), balance[owner()]);
  }

  function _validatePaymasterUserOp(
    UserOperation calldata userOp,
    bytes32,
    uint256 maxCost
  ) internal view override returns (bytes memory context, uint256 validationData) {
    /**
     * the paymaster will only pay for transactions that are to the HealthRecordManager
     * if the provided sponsor has enough balance to cover the gas cost
     *
     * its important to return a sig_fail rather than revert if any of the above conditions are false
     * for better gas estimation.
     */
    address sponsor = abi.decode(userOp.paymasterAndData[20:], (address));
    address to = abi.decode(userOp.callData[4:36], (address));

    bool canSponsor = balance[sponsor] > maxCost;

    bool isToHealthManager = to == healthRecordManager;

    bool sigFail = !canSponsor || !isToHealthManager;
    context = abi.encode(sponsor);
    validationData = _packValidationData(sigFail, uint48(0), uint48(0));
  }

  function _postOp(PostOpMode, bytes calldata context, uint256 actualGasCost) internal override {
    address sponsor = abi.decode(context, (address));
    balance[sponsor] -= actualGasCost;
  }
}
