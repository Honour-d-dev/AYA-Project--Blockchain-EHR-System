// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.18;

contract HealthRecordManager {
  mapping(address owner => string cid) private record;
  mapping(address owner => mapping(address viewer => bool access)) private hasAccess;

  function grantAccess(address someone) external {
    hasAccess[msg.sender][someone] = true;
  }

  function revokeAccess(address someone) external {
    hasAccess[msg.sender][someone] = false;
  }

  function updateHealthRecord(string memory cid) external {
    record[msg.sender] = cid;
  }

  function updateHealthRecordFor(address someone, string memory cid) external {
    require(hasAccess[someone][msg.sender], "unauthorized");
    record[someone] = cid;
  }

  function getHealthRecord() external view returns (string memory) {
    return record[msg.sender];
  }

  function getHealthRecordFor(address someone) external view returns (string memory) {
    require(hasAccess[someone][msg.sender], "unauthorized viewer");
    return record[someone];
  }
}
