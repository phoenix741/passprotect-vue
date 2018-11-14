export let signup

export function setSignupHandler (handler) {
  signup = handler
}

export let login

export function setLoginHandler (handler) {
  login = handler
}

export let logout

export function setLogoutHandler (handler) {
  logout = handler
}

export let SESSION = {
  authenticated: false
}

export function setSession (session) {
  SESSION = session
}
