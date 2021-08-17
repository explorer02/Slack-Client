const BASE_URL = "http://localhost:3000";

export const ajaxClient = {
  async get<T>(relativeURL: string = ""): Promise<T> {
    const response = await fetch(BASE_URL + relativeURL);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.result as T;
  },
  async post(relativeURL: string = "", body: any): Promise<any> {
    const response = await fetch(BASE_URL + relativeURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.result;
  },
};
