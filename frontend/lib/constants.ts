import { Address, encodeAbiParameters, parseAbiParameters } from "viem";
import { sepolia } from "viem/chains";

export const chain = sepolia;

export const HealthRecordManagerAddress: Address = "0x09e830871cd63e135d401e7d12b12d2b7183bdd0";

export const PayManagerAddress: Address = "0x7329802498c77d54c3d204e6ea696851f71b7ab0";

export const payManagerV2: Address = "0xdf8ff2de45cfdddfe20c1b924f56818db083d1e7";

export const gateway = (cid: string) => `https://w3s.link/ipfs/${cid}` as const;

const dummyId = "0xfFFfFffFfffffFfFfffF00000000000000000000";

export const defaultSponsor = "0x8d846db5EBFB11b9c647934e4420f0346B39CD89";

export const encodePaymasterData = (sponsor: Address) => encodeAbiParameters(parseAbiParameters("address"), [sponsor]);

export const dummyPaymasterData = encodePaymasterData(dummyId);

export const users = ["invalidUser", "Admin", "HealthCI", "Researcher", "Doctor", "Patient"] as const;
