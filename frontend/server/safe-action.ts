import { createSafeActionClient } from "next-safe-action";

export const action = createSafeActionClient({
  handleReturnedServerError(e) {
    return { serverError: `message: ${e.message}. \n ${e.stack} \n ${e.cause}` };
  },
});
