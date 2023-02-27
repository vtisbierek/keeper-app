import { getToken } from "./token";

export const getGoogleInfo = async () => {
  try {
    const token = await getToken();
    console.log(
      "googleApi.js 49 | getting google info with token",
      token
    );
    const request = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await request.json();
    console.log("googleApi.js 24 | got google info", data);
    const userData = {
      picture: data.picture,
      email: data.email,
      fName: data.given_name,
      lName: data.family_name,
      sub: data.sub,
      fullName: data.name
    };

    return userData;
  } catch (error) {
    console.log("googleApi.js 35 | error getting google info", error);
    return error.message;
  }
};