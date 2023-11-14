import {
  LightSmartContractAccount,
  getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import {
  Hex,
  LocalAccountSigner,
  SmartAccountProvider,
  SmartAccountSigner,
} from "@alchemy/aa-core";
import { decrypt, encrypt } from "@metamask/browser-passworder";
import {
  HDAccount,
  PublicActions,
  WalletClient,
  createWalletClient,
  http,
  publicActions,
  toHex,
} from "viem";
import { english, generateMnemonic, mnemonicToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

export default class Account {
  seedPhrase: string;
  eoaClient: WalletClient & PublicActions;
  smartClient: SmartAccountProvider;
  cid?: string;

  constructor(seedPhrase?: string) {
    if (seedPhrase) {
      this.seedPhrase = seedPhrase;
    } else {
      this.seedPhrase = generateMnemonic(english);
    }

    this.eoaClient = createWalletClient({
      account: mnemonicToAccount(this.seedPhrase),
      transport: http(),
    }).extend(publicActions);

    const chain = sepolia;

    const smartSigner = LocalAccountSigner.mnemonicToAccountSigner(
      this.seedPhrase,
    );
    this.smartClient = new AlchemyProvider({
      apiKey: process.env.API_KEY!, // Replace with your Alchemy API key
      chain,
      // Entrypoint address, you can use a different entrypoint if needed, check out https://docs.alchemy.com/reference/eth-supportedentrypoints for all the supported entrypoints
      entryPointAddress: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
    }).connect(
      (rpcClient) =>
        new LightSmartContractAccount({
          entryPointAddress: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
          chain: rpcClient.chain,
          owner: smartSigner,
          factoryAddress: getDefaultLightAccountFactoryAddress(rpcClient.chain),
          rpcClient,
        }),
    );
    /**
     * should make a call to initUser here if a cid is passed in
     */
  }

  publicKey(): Hex {
    return mnemonicToAccount(this.seedPhrase).publicKey;
  }

  privateKey(): Hex | null {
    const pk = mnemonicToAccount(this.seedPhrase).getHdKey().privateKey;
    if (pk) {
      return toHex(pk);
    }
    return null;
  }

  smartAccountAddress(): Promise<Hex> {
    return this.smartClient.getAddress();
  }

  static async init(password: string) {
    const enAccount = localStorage.getItem("account");
    return (await decrypt(password, enAccount!)) as Account;
  }
}
