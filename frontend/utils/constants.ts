import "dotenv/config";
import { Address, encodeAbiParameters, parseAbiParameters } from "viem";
import { sepolia } from "viem/chains";

export const chain = sepolia;

export const HealthRecordManagerAddress: Address =
  "0xcc5307ba8e8c4138ec390b4c3378bc56a3dd78e9";

export const PayManagerAddress: Address =
  "0x7329802498c77d54c3d204e6ea696851f71b7ab0";

export const payManagerV2: Address =
  "0xdf8ff2de45cfdddfe20c1b924f56818db083d1e7";

const dummyId = "0xfFFfFffFfffffFfFfffF00000000000000000000";

export const defaultSponsor = "0x8d846db5EBFB11b9c647934e4420f0346B39CD89";

export const encodePaymasterData = (sponsor: Address) =>
  encodeAbiParameters(parseAbiParameters("address"), [sponsor]);

export const dummyPaymasterData = encodePaymasterData(dummyId);

export const users = [
  "invalidUser",
  "Admin",
  "HealthCI",
  "Researcher",
  "Doctor",
  "Patient",
] as const;

const oldpaymaster = "0xf86d095531a200c4cb4a196372e140ed890ac9bc";
("0x733ef4e50f6228125d67c0f02087f52a1058a846");
//v2
("0xe71cba287b7dd205a03bbe4813cecbcf43886264");
