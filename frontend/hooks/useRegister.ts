"use client";

import { Address, encodeFunctionData } from "viem";
import { useAccount } from "./accountContext";
import { HealthRecordManagerV2Abi } from "@/abis/HeahthRecordManagerV2abi";
import { HealthRecordManagerAddress, defaultSponsor, encodePaymasterData, users } from "@/utils/constants";
import { useEffect, useState } from "react";
import { useW3 } from "@/hooks/useW3";
import { UserInfo, ValidUserTypes } from "@/utils/types";
import { useRouter } from "next/navigation";

export const useRegister = <T extends ValidUserTypes>(type: T, userDetails: UserInfo<T>) => {
  const [accountCreated, setAccountCreated] = useState(false);
  /**TODO: add states for each registration phase */
  const { isLoggedIn, ownerAddress, smartClient, magicClient, loginExistingUser, login } = useAccount();
  const [{ client }] = useW3();
  const router = useRouter();

  useEffect(() => {
    async function register() {
      if (isLoggedIn && ownerAddress && smartClient && client && accountCreated) {
        const file = new File([new Blob([JSON.stringify(userDetails)])], `${userDetails.email}`, {
          type: "application/json",
        });
        console.log(file);
        /**Todo :check currentSpace before uploading, possibly throw an error */
        const cid = await client.uploadFile(file);
        console.log(cid.toString());

        const uo = await smartClient.sendUserOperation(
          {
            data: encodeFunctionData({
              abi: HealthRecordManagerV2Abi,
              functionName: "initUser",
              args: [ownerAddress, cid.toString(), userDetails.email, users.indexOf(type)],
            }),
            target: HealthRecordManagerAddress,
          },
          {
            paymasterAndData: encodePaymasterData(sponsor() ?? defaultSponsor),
          },
        );

        console.log(uo);
        router.push(`/${type}?cid=${cid.toString()}`);
      }
    }

    register();
  }, [isLoggedIn, ownerAddress, smartClient, client, accountCreated]);

  if ("healthCareId" in userDetails && typeof userDetails.healthCareId === "string") {
    userDetails.healthCareId;
  }

  const sponsor = () => {
    return "healthCareId" in userDetails
      ? Array.isArray(userDetails.healthCareId)
        ? (userDetails.healthCareId[0] as Address)
        : (userDetails.healthCareId as Address)
      : undefined;
  };

  const initAccount = async () => {
    if (!magicClient) {
      throw new Error("magic not initialized");
    }
    /** first check if the user already exists */
    const isUser = await magicClient.readContract({
      abi: HealthRecordManagerV2Abi,
      address: HealthRecordManagerAddress,
      functionName: "isUser",
      args: [userDetails.email],
    });

    if (isUser) {
      /**ideally should error saying user exists rather than
       * try to log them in
       */
      await loginExistingUser(userDetails.email);
    }

    await login(userDetails.email);
    setAccountCreated(true);
  };

  return initAccount;
};
