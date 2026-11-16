const developmentOverride = import.meta.env.DEV && import.meta.env.VITE_API_BASE_URL;

export const apiBaseUrl = developmentOverride ? developmentOverride.replace(/\/+$/, "") : "/api";
