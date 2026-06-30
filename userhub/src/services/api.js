import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  timeout: 10000,
});

http.interceptors.response.use(
  (r) => r,
  (err) => {
    const msg =
      err.response?.data?.message ||
      err.response?.data?.errorMessage ||
      err.message ||
      "Something went wrong";
    return Promise.reject(new Error(msg));
  }
);

export const userService = {
  getAll:  ()        => http.get("/users").then((r) => r.data),
  getById: (id)      => http.get(`/user/${id}`).then((r) => r.data),
  create:  (data)    => http.post("/user", data).then((r) => r.data),
  update:  (id, d)   => http.put(`/update/user/${id}`, d).then((r) => r.data),
  remove:  (id)      => http.delete(`/delete/user/${id}`).then((r) => r.data),
  stats:   ()        => http.get("/stats").then((r) => r.data),
  search:  (q)       => http.get("/search", { params: { q } }).then((r) => r.data),
  downloadPdf: (id, filename) =>
    http.get(`/user/${id}/pdf`, { responseType: "blob" }).then((r) => {
      const url = URL.createObjectURL(r.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "profile.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }),
};

export default http;
