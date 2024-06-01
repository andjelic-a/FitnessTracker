const baseAPIUrl = "http://localhost:5054/api";

export function getIsLoggedIn() {
  return localStorage.getItem("token") !== null;
}

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

export async function getAuthorizationHeader(): Promise<
  `Bearer ${string}` | null
> {
  const jwt = localStorage.getItem("token");
  if (jwt === null) return null;

  if (jwt === "") {
    localStorage.removeItem("token");
    console.log("Something went really wrong..."); //TODO: Delete this entire if after testing and fixing if needed
    return null;
  }

  if (!isJWTExpired(jwt)) return `Bearer ${jwt}`;

  return await fetch(`${baseAPIUrl}/user/refresh`, {
    headers: { Authorization: `Bearer ${jwt}` },
    method: "GET",
    credentials: "include",
  })
    .then((result) => result.text())
    .then((newToken) => {
      if (newToken === "Invalid token") {
        localStorage.removeItem("token");
        return null;
      }

      localStorage.setItem("token", newToken);
      return `Bearer ${newToken}` as `Bearer ${string}`;
    })
    .catch((err) => {
      console.error("err --->" + err);
      localStorage.removeItem("token");
      return null;
    });
}

export async function getCurrentUserData() {
  const bearer = await getAuthorizationHeader();
  if (!bearer) return null;

  return fetch(`${baseAPIUrl}/user`, {
    method: "GET",
    headers: {
      Authorization: bearer,
    },
  })
    .then((result) => result.json())
    .catch((err) => {
      console.error(err);
    });
}

export async function login(email: string, password: string): Promise<boolean> {
  return fetch(`${baseAPIUrl}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  })
    .then((result) => result.text())
    .then((newToken) => {
      if (newToken === "Incorrect email or password") return false;

      localStorage.setItem("token", newToken);
      return true;
    })
    .catch((err) => {
      console.error(err);
      return false;
    });
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<boolean> {
  if (password.length < 8 || email === "" || name === "") return false;

  return fetch(`${baseAPIUrl}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  })
    .then((result) => result.text())
    .then((newToken) => {
      if (newToken === "User already exists") return false;

      localStorage.setItem("token", newToken);
      return true;
    })
    .catch((err) => {
      console.error(err);
      return false;
    });
}
