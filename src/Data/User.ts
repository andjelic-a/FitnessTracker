const baseAPIUrl = "http://192.168.1.100:5054/api";

export function getIsLoggedIn() {
  return localStorage.getItem("token") !== null;
}

export async function getCurrentUserData() {
  return fetch(`${baseAPIUrl}/user/authenticate`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then((result) => result.json());
}

export async function login(email: string, password: string): Promise<boolean> {
  return fetch(`${baseAPIUrl}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((result) => result.text())
    .then((newToken) => {
      if (!newToken) return false;

      localStorage.setItem("token", newToken);
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}
