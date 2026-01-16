import { Amplify } from "aws-amplify";

export function configureAmplify() {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: import.meta.env.VITE_USER_POOL_ID || "",
        userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID || "",
        region: import.meta.env.VITE_REGION || "ap-northeast-1",
      },
    },
    API: {
      REST: {
        apiEndpoint: {
          endpoint: import.meta.env.VITE_API_ENDPOINT || "",
          region: import.meta.env.VITE_REGION || "ap-northeast-1",
        },
      },
    },
  });
}
