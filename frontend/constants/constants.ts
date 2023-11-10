import "dotenv/config";
//ts-ignore
import { Web3Storage } from "web3.storage";

const accessToken = process.env.TOKEN_ID!;

export const storageClient = new Web3Storage({ token: accessToken });

export const users = [
  "invalidUser",
  "Admin",
  "HealthCI",
  "HealthCP",
  "Doctor",
  "Patient",
] as const;
