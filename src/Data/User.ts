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

export async function getAuthorization(): Promise<string | null> {
  const jwt = localStorage.getItem("token");
  if (jwt === null) return null;

  if (jwt === "") {
    localStorage.removeItem("token");
    console.log("Something went really wrong..."); //TODO: Delete this entire if after testing and fixing if needed
    return null;
  }

  if (!isJWTExpired(jwt)) return "Bearer " + jwt;

  return await fetch(`${baseAPIUrl}/user/refresh`, {
    headers: { Authorization: `Bearer ${jwt}` },
    method: "PUT",
    credentials: "include",
  })
    .then((result) => result.text())
    .then((newToken) => {
      console.log("new token ---> " + newToken);
      if (newToken === "Invalid token") {
        localStorage.removeItem("token");
        return null;
      }

      localStorage.setItem("token", newToken);
      return "Bearer " + newToken;
    })
    .catch((err) => {
      console.error("err --->" + err);
      localStorage.removeItem("token");
      return null;
    });
}

export async function getCurrentUserData() {
  const bearer = await getAuthorization();
  if (!bearer) return null;

  return fetch(`${baseAPIUrl}/user/authenticate`, {
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
      if (!newToken) return false;

      localStorage.setItem("token", newToken);
      return true;
    })
    .catch((err) => {
      console.error(err);
      return false;
    });
}
