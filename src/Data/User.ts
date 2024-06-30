import sendAPIRequest from "./SendAPIRequest";

export function isJWTExpired(jwt: string) {
  const parts = jwt.split(".");
  if (parts.length !== 3) {
    localStorage.removeItem("token");
    return true;
  }

  const payload = JSON.parse(window.atob(parts[1]));
  const exp = payload.exp;
  return exp * 1000 < Date.now();
}

export async function getBearerToken(): Promise<`Bearer ${string}` | null> {
  const jwt = localStorage.getItem("token");
  if (jwt === null) return null;

  if (!isJWTExpired(jwt)) return `Bearer ${jwt}`;

  const response = await sendAPIRequest(
    {
      endpoint: "/api/user/refresh",
      request: {
        method: "post",
      },
    },
    `Bearer ${jwt}`
  );

  if (response.code === "Created") {
    localStorage.setItem("token", response.content.token);
    return `Bearer ${response.content.token}`;
  }

  if (response.code === "Unauthorized") localStorage.removeItem("token");
  return null; //TODO: Handle errors
}

export async function login(email: string, password: string): Promise<boolean> {
  const response = await sendAPIRequest(
    {
      endpoint: "/api/user/login",
      request: {
        method: "post",
        payload: {
          email: email.trim(),
          password,
        },
      },
    },
    null
  );

  if (response.code !== "Created") return false;

  localStorage.setItem("token", response.content.token);
  return true;
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<boolean> {
  if (password.length < 8 || email === "" || name === "") return false;

  const response = await sendAPIRequest(
    {
      endpoint: "/api/user/register",
      request: {
        method: "post",
        payload: {
          name: name.trim(),
          email: email.trim(),
          password,
        },
      },
    },
    null
  );

  if (response.code !== "Created") return false;

  localStorage.setItem("token", response.content.token);
  return true;
}

export async function logout(): Promise<void> {
  const bearer = await getBearerToken();
  if (bearer === null) return;

  sendAPIRequest(
    {
      endpoint: "/api/user/logout",
      request: {
        method: "delete",
      },
    },
    bearer
  );

  localStorage.removeItem("token");
}
