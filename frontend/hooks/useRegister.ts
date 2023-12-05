"use client";

import { Address, encodeFunctionData } from "viem";
import { useAccount } from "./accountContext";
import { HealthRecordManagerV2Abi } from "@/abis/HeahthRecordManagerV2abi";
import { HealthRecordManagerAddress, defaultSponsor, encodePaymasterData, users } from "@/lib/constants";
import { useEffect, useState } from "react";
import { useW3 } from "@/hooks/useW3";
import { UserInfo, ValidUserTypes } from "@/lib/types";
import { useRouter } from "next/navigation";

export const useRegister = <T extends ValidUserTypes>(type: T, userDetails: UserInfo<T>) => {
  const [accountCreated, setAccountCreated] = useState(false);
  const [error, setError] = useState<string>();
  const [progress, setProgress] = useState<"Authenticating" | "Generating cid" | "Sending userOp" | null>(null);
  const { isLoggedIn, ownerAddress, smartClient, magicClient, login } = useAccount();
  const [{ client }] = useW3();
  const router = useRouter();

  useEffect(() => {
    async function register() {
      if (isLoggedIn && ownerAddress && smartClient && client && accountCreated) {
        const file = new File([new Blob([JSON.stringify(userDetails)])], `${userDetails.email}`, {
          type: "application/json",
        });
        console.log(file);

        try {
          if (!client.currentSpace()) throw new Error("client doesn't have a space");

          setProgress("Generating cid");
          const cid = await client.uploadFile(file);
          console.log(cid.toString());

          setProgress("Sending userOp");
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
        } catch (e) {
          let error = "";
          if (e instanceof Error) error = e.message;
          setError(`user registration failed: ${error}`);
          setProgress(null);
        }
      }
    }

    register();
  }, [isLoggedIn, ownerAddress, smartClient, client, accountCreated]);

  const sponsor = () => {
    return "healthCareId" in userDetails
      ? Array.isArray(userDetails.healthCareId)
        ? userDetails.healthCareId[0]
        : userDetails.healthCareId
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
      setError("email already exists");
      setProgress(null);
      /**TODO should return here
       * not adding the return for testing purposes
       */
    }
    try {
      setProgress("Authenticating");
      await login(userDetails.email);
      setAccountCreated(true);
    } catch (e) {
      let error = "";
      if (e instanceof Error) error = e.message;
      setError(`magic authentication failed: ${error}`);
      setProgress(null);
    }
  };

  return { initAccount, progress, error };
};
