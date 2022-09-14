import fetch from "node-fetch";

export const NanoleafAuthorization = {

    getToken: async (url:string): Promise<string | null> => {
        try {
            let response = await fetch(`${url}/api/v1/new`, {
                method: "POST"
            });

            let data = await response.json();

            if(typeof data.auth_token === "string") return data.auth_token;
        } catch(err) {}

        return null;
    }

};