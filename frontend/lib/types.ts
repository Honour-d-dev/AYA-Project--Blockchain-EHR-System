import { Address } from "viem";
import { users } from "./constants";

export type UserTypes = (typeof users)[number];

export type ValidUserTypes = Exclude<UserTypes, "invalidUser" | "Admin">;

export type UserInfo<T extends ValidUserTypes> = T extends "HealthCI"
  ? Omit<_UserInfo<T>, "firstName" | "lastName" | "DOB">
  : _UserInfo<T>;

type _UserInfo<T extends ValidUserTypes> = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  DOB?: string;
} & Partial<_User[T]>;

type _User = {
  Patient: Patient;
  Doctor: Doctor;
  Researcher: Researcher;
  HealthCI: HealthCI;
};

type Patient = {
  acessList: Address[];
  healthCareId: Address[];
  session: {
    diagnosis: string;
    medication: string;
    healthCareInfo: {
      id: Address;
      location: string;
      doctorId: Address;
    }[];
  };
  appointment: {
    date: string;
    hospital: string;
  };
};

type Doctor = {
  healthCareId: Address;
  accessList: Address[];
  appointment: {
    date: string;
    patient: Address;
  };
};

type Researcher = {};

type HealthCI = {
  name: string;
  address: string;
  doctors: Address[];
};

let a: UserInfo<"HealthCI">;
