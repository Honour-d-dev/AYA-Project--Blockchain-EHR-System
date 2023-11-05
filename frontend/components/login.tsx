import { decrypt } from "@metamask/browser-passworder";
import { AccountContext } from "@/components/context/accountContext";
import { useContext } from "react";
import { mnemonicToAccount } from "viem/accounts";
import { Hex, createWalletClient, http, publicActions } from "viem";

export default function Login() {
  const { setAccount } = useContext(AccountContext);

  const unlock = async () => {
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;
    const enData = localStorage.getItem("data");
    try {
      const deData = (await decrypt(password, enData!)) as string;
      const account = mnemonicToAccount(deData);
      setAccount({
        account,
        client: createWalletClient({
          account,
          transport: http(),
        }).extend(publicActions),
      });
    } catch (e) {
      //display the error message e.message
      //(e as Error).message
    }
  };

  return (
    <div className="flex flex-col rounded-md p-8">
      <label htmlFor="password">
        Enter password
        <input type="text" id="password" />
      </label>
      <button onClick={unlock}>login</button>
    </div>
  );
}
