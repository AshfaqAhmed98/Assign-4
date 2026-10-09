import { betterAuth } from "better-auth";

function getOAuthCredentials(
  provider: "GOOGLE" | "GITHUB",
): { clientId: string; clientSecret: string } | undefined {
  const clientId = process.env[`${provider}_CLIENT_ID`]?.trim();
  const clientSecret = process.env[`${provider}_CLIENT_SECRET`]?.trim();

  if (Boolean(clientId) !== Boolean(clientSecret)) {
    console.error(
      `Better Auth ${provider} OAuth is disabled: configure both ${provider}_CLIENT_ID and ${provider}_CLIENT_SECRET.`,
    );
    return undefined;
  }

  return clientId && clientSecret ? { clientId, clientSecret } : undefined;
}

const googleCredentials = getOAuthCredentials("GOOGLE");
const githubCredentials = getOAuthCredentials("GITHUB");

const socialProviders = {
  ...(googleCredentials ? { google: googleCredentials } : {}),
  ...(githubCredentials ? { github: githubCredentials } : {}),
};

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: false,
  },
  account: {
    accountLinking: {
      trustedProviders: ["google", "github"],
      requireLocalEmailVerified: false,
    },
  },
  socialProviders,
});
