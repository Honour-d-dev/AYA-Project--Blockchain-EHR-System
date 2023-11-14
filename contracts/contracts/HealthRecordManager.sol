// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

contract HealthRecordManager {
  enum UserTypes {
    InvalidUser,
    Admin,
    HealthCI, //healthcare institution
    Researcher,
    Doctor,
    Patient
  }

  struct Patient {
    address owner;
    string cid;
    address[] acesslist;
    //bool isRsearch;
  }

  struct HealthCI {
    address admin;
    address[] doctors;
    address[] patients;
  }

  struct Doctor {
    address owner;
    address[] patients;
  }

  address payManager;

  mapping(address id => Patient) private patients;
  mapping(address id => Doctor) private doctors;
  mapping(address id => HealthCI) private hospitals;
  mapping(address id => UserTypes) usertype;
  mapping(address ownerId => mapping(address viewerId => bool access)) private hasAccess;

  constructor() {
    usertype[msg.sender] = UserTypes.Admin;
  }

  function addPayManager(address pm) external onlyAdmin {
    payManager = pm;
  }

  function initPatient(address id, string memory cid) external {
    patients[id].owner = msg.sender;
    patients[id].cid = cid;
    usertype[id] = UserTypes.Patient;
  }

  function initHealthCI(address id) external {
    hospitals[id].admin = msg.sender;
    usertype[id] = UserTypes.HealthCI;
  }

  function initDoctor(address id) external {
    doctors[id].owner = msg.sender;
    usertype[id] = UserTypes.Doctor;
  }

  function initResearcher(address id) external {
    usertype[id] = UserTypes.Researcher;
  }

  function grantAccess(address id, address someone) external {
    Patient storage user = patients[id];
    require(user.owner == msg.sender, "unauthorized");
    user.acesslist.push(someone);
    hasAccess[id][someone] = true;
  }

  function revokeAccess(address id, address someone) external {
    Patient storage user = patients[id];
    require(user.owner == msg.sender, "unauthorized");
    uint length = user.acesslist.length;
    for (uint i; i < length; i++) {
      if (user.acesslist[i] == someone) {
        if (i == length - 1) {
          user.acesslist.pop();
        } else {
          user.acesslist[i] = user.acesslist[length - 1];
          user.acesslist.pop();
        }
      }
    }
    hasAccess[id][someone] = false;
  }

  function updateHealthRecord(address id, string memory cid) external {
    Patient storage user = patients[id];
    require(user.owner == msg.sender, "unauthorized");
    user.cid = cid;
  }

  function updateHealthRecordFor(address id, address someoneId, string memory cid) external {
    require(usertype[id] == UserTypes.Doctor, "Only doctors can update someone else record");
    Doctor storage user = doctors[id];
    require(user.owner == msg.sender, "unauthorized");
    require(hasAccess[someoneId][id], "unauthorized");
    patients[someoneId].cid = cid;
  }

  function getHealthRecord() external view returns (string memory) {
    return patients[msg.sender].cid;
  }

  function getHealthRecordFor(address someoneId) external view returns (string memory) {
    require(hasAccess[someoneId][msg.sender], "unauthorized viewer");
    return patients[someoneId].cid;
  }

  function getAccessList() external view returns (address[] memory) {
    require(usertype[msg.sender] == UserTypes.Patient, "not a patient");
    return patients[msg.sender].acesslist;
  }

  function isOwner(address id, address owner) external view returns (bool) {
    require(msg.sender == payManager, "not pay manager");
    if (patients[id].owner != owner) {
      return false;
    }
    return true;
  }

  modifier onlyAdmin() {
    require(usertype[msg.sender] == UserTypes.Admin, "not authorized");
    _;
  }
}
