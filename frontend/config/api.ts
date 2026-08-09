import Constants from "expo-constants";

// Set EXPO_PUBLIC_API_URL in your .env (or app.json extra) once the backend
// is deployed to Render. Falls back to localhost for local dev.
export const API_URL =
    Constants.expoConfig?.extra?.apiUrl ??
    process.env.EXPO_PUBLIC_API_URL ??
    "http://localhost:5000";

export const api = {
    get: (path: string, token?: string) =>
        fetch(`${API_URL}${path}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }).then((r) => r.json()),

    post: (path: string, body: unknown, token?: string) =>
        fetch(`${API_URL}${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(body),
        }).then((r) => r.json()),

    put: (path: string, body: unknown, token?: string) =>
        fetch(`${API_URL}${path}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(body),
        }).then((r) => r.json()),

    delete: (path: string, token?: string) =>
        fetch(`${API_URL}${path}`, {
            method: "DELETE",
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }).then((r) => r.json()),
};
