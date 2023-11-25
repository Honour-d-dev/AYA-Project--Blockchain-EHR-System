// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@account-abstraction/contracts/core/BasePaymaster.sol";

interface IHealthRecordManager {
  function isOwner(address, address) external returns (bool);
}

contract PayManager is BasePaymaster {
  mapping(address sponsor => uint availableBalance) balance;
  mapping(address id => bool idInitialized) hasInitialized;

  address constant dummyId = 0xfFFfFffFfffffFfFfffF00000000000000000000;
  address private sponsorlessId;

  address private healthRecordManager;

  constructor(IEntryPoint entryPoint, address _sponsorlessId) BasePaymaster(entryPoint) Ownable(msg.sender) {
    sponsorlessId = _sponsorlessId;
  }

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
     * the paymaster data includes the sender's id and the sponsors id
     * the paymaster first verifies that the sender's id belongs to the userOp.sender
     * and that the sponsor has enough balance to pay for the transaction if one is included
     *
     * for some reason eth_estimateUserOperationGas always reverts here, PayManagerV2 uses a simpler approach that
     * seems to work for now
     */
    (address id, address sponsor) = parsePaymasterData(userOp.paymasterAndData);

    (bool success, bytes memory returndata) = healthRecordManager.staticcall(
      abi.encodeCall(IHealthRecordManager.isOwner, (id, userOp.sender))
    );
    bool isMatch = abi.decode(returndata, (bool));

    /**peforming dummy check late for more accurate gas estimation */
    if (id == dummyId && sponsor == dummyId) {
      context = abi.encode("Dummy context");
      validationData = _packValidationData(true, uint48(0), uint48(0));
    } else {
      require(success && (isMatch || !hasInitialized[id]), "failed");
      if (sponsor != sponsorlessId) {
        require(balance[sponsor] >= maxCost, "insufficient Sponsor Balance");
        context = abi.encode(id, sponsor);
      } else {
        require(balance[owner()] >= maxCost, " insufficient Paymaster Balance");
        context = abi.encode(id, owner());
      }

      validationData = _packValidationData(false, uint48(0), uint48(0));
    }
  }

  function _postOp(PostOpMode mode, bytes calldata context, uint256 actualGasCost) internal override {
    (address id, address sponsor) = abi.decode(context, (address, address));
    balance[sponsor] -= actualGasCost;
    if (mode == PostOpMode.opSucceeded && !hasInitialized[id]) {
      hasInitialized[id] = true;
    }
  }

  function parsePaymasterData(bytes calldata paymasterData) internal pure returns (address id, address sponsor) {
    (id, sponsor) = abi.decode(paymasterData[20:], (address, address));
  }
}
