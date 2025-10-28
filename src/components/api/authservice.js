import API from "./axiosConfig";

export const authServices = {
  register: (userData) => {
    API.post("/auth/register", userData);
  },
};
