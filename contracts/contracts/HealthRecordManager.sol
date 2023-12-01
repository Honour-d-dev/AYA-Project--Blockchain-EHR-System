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
  }

  struct Doctor {
    address owner;
    string cid;
    address heaithCareId;
  }

  struct HealthCI {
    address admin;
    string cid;
    address[] doctors;
    address[] patients;
  }

  struct Researcher {
    address owner;
    string cid;
  }

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
    hasAccess[id][someone] = true;
  }

  function revokeAccess(address id, address someone) external {
    Patient storage user = patients[id];
    require(user.owner == msg.sender, "unauthorized");
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

  function gerUserType(string memory email) external view returns (UserTypes) {
    return usertype[medistashUser[email]];
  }

  modifier onlyAdmin() {
    require(usertype[msg.sender] == UserTypes.Admin, "not authorized");
    _;
  }
}
