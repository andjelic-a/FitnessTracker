function ValidateEmail({ email }: { email: string }): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function ValidatePassword({ password }: { password: string }): boolean {
    const re = /^(?=.*\d)(?=.*[a-z]).{8,}$/;
    return re.test(password);
}

function ValidateUsername({ username }: { username: string }): boolean {
    const re = /^[a-zA-Z0-9]{3,}$/;
    return re.test(username);
}