//  SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

contract HealthRecordManagerV2 {
  enum UserType {
    InvalidUser,
    Admin,
    HealthCI, //healthcare institution
    Researcher,
    Doctor,
    Patient
  }

  struct User {
    address owner;
    string cid;
    UserType userType;
  }

  //for pre-verification
  mapping(string email => address id) private medistashUser;

  mapping(address id => User) private users;
  mapping(address ownerId => mapping(address viewerId => bool access)) private hasAccess;

  constructor(string memory email) {
    users[msg.sender].userType = UserType.Admin;
    medistashUser[email] = msg.sender;
  }

  function initUser(address id, string memory cid, string memory email, UserType userType) external {
    users[id].owner = msg.sender;
    users[id].cid = cid;
    users[id].userType = userType;
    medistashUser[email] = id;
  }

  function grantAccess(address id, address someone) external {
    User storage user = users[id];
    require(user.owner == msg.sender, "unauthorized");
    hasAccess[id][someone] = true;
  }

  function revokeAccess(address id, address someone) external {
    User storage user = users[id];
    require(user.owner == msg.sender, "unauthorized");
    hasAccess[id][someone] = false;
  }

  function updateHealthRecord(address id, string memory cid) external {
    User storage user = users[id];
    require(user.owner == msg.sender, "unauthorized");
    user.cid = cid;
  }

  function updateHealthRecordFor(address id, address someoneId, string memory cid) external {
    User storage user = users[id];
    require(user.owner == msg.sender, "unauthorized");
    require(hasAccess[someoneId][id], "unauthorized");
    users[someoneId].cid = cid;
  }

  function getHealthRecord() external view returns (string memory) {
    return users[msg.sender].cid;
  }

  function getHealthRecordFor(address someoneId) external view returns (string memory) {
    require(hasAccess[someoneId][msg.sender], "unauthorized viewer");
    return users[someoneId].cid;
  }

  function gerUserInfo(string memory email) external view returns (User memory) {
    require(medistashUser[email] == msg.sender, " unAuthorized");
    return users[msg.sender];
  }

  function isUser(string memory email) public view returns (bool) {
    return medistashUser[email] != address(0);
  }
}
