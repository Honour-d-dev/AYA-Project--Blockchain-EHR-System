import { Address } from "viem";
import { users } from "./constants";

export type UserTypes = (typeof users)[number];

export type ValidUserTypes = Exclude<UserTypes, "invalidUser" | "Admin">;

export type UserInfo<T extends keyof User> = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  DOB?: string;
} & Partial<User[T]>;

type User = {
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
  healthcareId: string;
  accessList: Address[];
  appointment: {
    date: string;
    patient: Address;
  };
};

type Researcher = {};

type HealthCI = {
  doctors: Address[];
};
