import { Api } from "@/lib/client";

// console.log();

const api = new Api({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  securityWorker: (token) => {
    if (token) {
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }
    return {};
  },
});

export default api;
