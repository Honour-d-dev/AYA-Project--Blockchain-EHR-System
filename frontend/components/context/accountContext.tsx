import {
  createContext,
  useState,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
} from "react";
import { HDAccount, WalletClient } from "viem";

type Account = {
  account: HDAccount;
  client: WalletClient;
};

interface TAccountContext {
  account?: Account;
  setAccount: Dispatch<SetStateAction<Account | undefined>>;
}

export const AccountContext = createContext({} as TAccountContext);

export const AccountProvider = ({ children }: PropsWithChildren) => {
  const [account, setAccount] = useState<Account>();
  return (
    <AccountContext.Provider value={{ account, setAccount }}>
      {children}
    </AccountContext.Provider>
  );
};
