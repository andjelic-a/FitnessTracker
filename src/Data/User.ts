import { APIResponse } from "../Types/Endpoints/ResponseParser";
import sendAPIRequest from "./SendAPIRequest";

export function isJWTExpired(jwt: string) {
  const parts = jwt.split(".");
  if (parts.length !== 3) {
    // localStorage.removeItem("token");
    return true;
  }

  const payload = JSON.parse(window.atob(parts[1]));
  const exp = payload.exp;
  return exp * 1000 < Date.now();
}

let currentRefreshPromise: Promise<
  APIResponse<"/api/user/refresh", "post">
> | null;

export async function getJWT(): Promise<string | null> {
  const jwt = localStorage.getItem("token");
  if (jwt === null) return null;

  if (!isJWTExpired(jwt)) return jwt;

  currentRefreshPromise ??= sendAPIRequest(
    "/api/user/refresh",
    {
      method: "post",
    },
    jwt,
    true
  );

  const response = await currentRefreshPromise;
  currentRefreshPromise = null;

  if (response.code === "Created") {
    localStorage.setItem("token", response.content.token);
    return response.content.token;
  }

  if (response.code === "Unauthorized") localStorage.removeItem("token");
  return null;
}

export async function login(email: string, password: string): Promise<boolean> {
  const response = await sendAPIRequest(
    "/api/user/login",
    {
      method: "post",
      payload: {
        email: email.trim(),
        password,
      },
    },
    null,
    true
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
    "/api/user/register",
    {
      method: "post",
      payload: {
        username: name.trim(),
        email: email.trim(),
        password,
      },
    },
    null,
    true
  );

  if (response.code !== "Created") return false;

  localStorage.setItem("token", response.content.token);
  return true;
}

export async function logout(clientSideOnly: boolean = false): Promise<void> {
  if (clientSideOnly) {
    localStorage.removeItem("token");
    window.location.reload();
    return;
  }

  const bearer = await getJWT();
  if (bearer === null) return;
  sendAPIRequest(
    "/api/user/logout",
    {
      method: "delete",
    },
    bearer,
    true
  );

  localStorage.removeItem("token");
  window.location.reload();
}
