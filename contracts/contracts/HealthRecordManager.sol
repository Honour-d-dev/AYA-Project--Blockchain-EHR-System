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
  }

  struct Doctor {
    address owner;
    address heaithCareId;
    address[] patients;
  }

  struct HealthCI {
    address admin;
    address[] doctors;
    address[] patients;
  }

  address payManager;
  //for pre-verification
  mapping(string email => address id) private medistashUser;

  mapping(address id => Patient) private patients;
  mapping(address id => Doctor) private doctors;
  mapping(address id => HealthCI) private hospitals;
  mapping(address id => UserTypes) private usertype;
  mapping(address ownerId => mapping(address viewerId => bool access)) private hasAccess;

  constructor(string memory email) {
    usertype[msg.sender] = UserTypes.Admin;
    medistashUser[email] = msg.sender;
  }

  function addPayManager(address pm) external onlyAdmin {
    payManager = pm;
  }

  function initPatient(address id, string memory cid, string memory email) external {
    patients[id].owner = msg.sender;
    patients[id].cid = cid;
    usertype[id] = UserTypes.Patient;
    medistashUser[email] = id;
  }

  function initHealthCI(address id, string memory email) external {
    hospitals[id].admin = msg.sender;
    usertype[id] = UserTypes.HealthCI;
    medistashUser[email] = id;
  }

  function initDoctor(address id, address healthCareId, string memory email) external {
    doctors[id].owner = msg.sender;
    doctors[id].heaithCareId = healthCareId;
    usertype[id] = UserTypes.Doctor;
    medistashUser[email] = id;
  }

  function initResearcher(address id, string memory email) external {
    usertype[id] = UserTypes.Researcher;
    medistashUser[email] = id;
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
    Doctor storage doctor = doctors[id];
    require(doctor.owner == msg.sender, "unauthorized");
    require(hasAccess[someoneId][id], "unauthorized");
    patients[someoneId].cid = cid;
  }

  //todo remove msg.sender from the getter/view functions, id should be passed as parameters instead
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

  function gerUserType(string memory email) external view returns (UserTypes) {
    return usertype[medistashUser[email]];
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
