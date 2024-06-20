/* Data fetch functions for JB2 API */

// URLs
const JB2_API = "/jobboss2/api/v1/";
const JB2_REGISTER = JB2_API + "register";
const JB2_LOGIN = JB2_API + "login";

// API credentials
const API_KEY = "E67E4E46-16B8-4C32-8B4D-2294C1EA6640";
const USERNAME = "API";
const PASSWORD = "EMSCO123";

export async function getAuthToken() {
  /* Gets auth token from JB2's register & login procedure.
     First, register client and obtain password hash, then
     login using the password hash, which returns an auth token. */

  // Reused POST request code for register & login procedure
  async function postRequest(endpoint, password) {
    return await fetch(
      `${endpoint}?apiKey=${API_KEY}&username=${USERNAME}&password=${password}`,
      { method: "POST", credentials: "include" },
    )
      .then((res) => {
        console.log(res.body);
        return res.json();
      })
      .then((json) => json.result);
  }

  let password_hash = await postRequest(JB2_REGISTER, PASSWORD);
  console.log(password_hash);

  return await postRequest(JB2_LOGIN, password_hash);
}
