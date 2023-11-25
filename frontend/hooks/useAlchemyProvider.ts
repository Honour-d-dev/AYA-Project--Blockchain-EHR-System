import {
  PayManagerAddress,
  chain,
  dummyPaymasterData,
  payManagerV2,
} from "@/utils/constants";
import {
  LightSmartContractAccount,
  getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import {
  PaymasterAndDataMiddleware,
  SmartAccountSigner,
  getDefaultEntryPointAddress,
  resolveProperties,
} from "@alchemy/aa-core";
import { useCallback, useState } from "react";
import { type Address, Hex, concatHex } from "viem";
import "dotenv/config";

export const useAlchemyProvider = () => {
  const [smartClient, setSmartClient] = useState<AlchemyProvider>(
    new AlchemyProvider({
      chain,
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
    }),
  );

  const paymasterDataMiddleware: PaymasterAndDataMiddleware = async (
    uoStruct,
  ) => {
    const uo = await resolveProperties(uoStruct);
    const paymasterAndData = concatHex([
      payManagerV2,
      uo.paymasterAndData as Hex,
    ]);

    const verificationGasLimit =
      BigInt(uo.verificationGasLimit ?? 0) + BigInt(1000);
    const preVerificationGas =
      BigInt(uo.preVerificationGas ?? 0) + BigInt(1000);
    const callGasLimit = BigInt(uo.callGasLimit ?? 0) + BigInt(1000);

    return {
      paymasterAndData,
      verificationGasLimit,
      preVerificationGas,
      callGasLimit,
    };
  };

  const dummyPaymasterDataMiddleware: PaymasterAndDataMiddleware = async (
    _uoStruct,
  ) => {
    const paymasterAndData = concatHex([payManagerV2, dummyPaymasterData]);
    return {
      paymasterAndData,
    };
  };

  const connectClientToAccount = useCallback(
    (signer: SmartAccountSigner, account?: Address) => {
      const connectedProvider: AlchemyProvider = smartClient
        .connect((smartClient) => {
          return new LightSmartContractAccount({
            rpcClient: smartClient,
            owner: signer,
            chain,
            entryPointAddress: getDefaultEntryPointAddress(chain),
            factoryAddress: getDefaultLightAccountFactoryAddress(chain),
            accountAddress: account,
          });
        })
        .withPaymasterMiddleware({
          paymasterDataMiddleware,
          dummyPaymasterDataMiddleware,
        });

      setSmartClient(connectedProvider);
      return connectedProvider;
    },
    [smartClient],
  );

  const disconnectClientFromAccount = useCallback(() => {
    const disconnectedProvider = smartClient.disconnect();

    setSmartClient(disconnectedProvider);
    return disconnectedProvider;
  }, [smartClient]);

  return { smartClient, connectClientToAccount, disconnectClientFromAccount };
};
