export function validateEmail(email: string | undefined | null): boolean {
  if (!email) return false;

  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.trim());
}

export function validatePassword(password: string | undefined | null): boolean {
  if (!password) return false;

  const re = /^(?=.*\d)(?=.*[a-z]).{8,}$/;
  return re.test(password);
}

export function validateUsername(username: string | undefined | null): boolean {
  if (!username) return false;

  const re = /^[a-zA-Z0-9]{3,}$/;
  return re.test(username.trim());
}
