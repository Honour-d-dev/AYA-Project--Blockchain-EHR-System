// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.18;

contract LoginManager {
  enum UserTypes {
    InvalidUser,
    Admin,
    HealthCI, //healthcare institution
    HealthCP, //healthcare professional/Researcher
    Doctor,
    Patient
  }

  mapping(address => UserTypes) user;

  modifier onlyAdmin() {
    require(user[msg.sender] == UserTypes.Admin, "not authorized");
    _;
  }

  constructor() {
    user[msg.sender] = UserTypes.Admin;
  }

  function addT1user(address _user, UserTypes usertype) external onlyAdmin {
    user[_user] = usertype;
  }

  function addT2User(UserTypes usertype) external {
    require(usertype == UserTypes.Doctor || usertype == UserTypes.Patient, "not a valid Tier2 user");
    user[msg.sender] = usertype;
  }

  function getUserType() external view returns (UserTypes) {
    return user[msg.sender];
  }
}
