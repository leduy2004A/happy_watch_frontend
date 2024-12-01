import axios from "axios";
axios.interceptors.request.use(function (config) {
  config.baseURL = "http://localhost:8080";

  // Lấy token từ localStorage
  const token = localStorage.getItem("token"); // Thay "token" bằng key bạn đã lưu trong localStorage

  // Nếu token tồn tại, thêm nó vào header Authorization
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
// const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImxlZHV5NDUyMEBnbWFpbC5jb20iLCJpZCI6NywiZXhwIjoxNzMzMDkzNDE3NTU2LCJhdXRob3JpdGllcyI6WyJST0xFX1VTRVIiXX0.bse9Gqq_MuUy3NFLTOOrZT93GvXCrUQmsXYYs28ng0k'
// config.headers.Authorization = `Bearer ${token}`;
  return config;
}, function (error) {
  // Xử lý lỗi request
  return Promise.reject(error);
});
// Thêm một bộ đón chặn response
axios.interceptors.response.use(function (response) {
    // Bất kì mã trạng thái nào nằm trong tầm 2xx đều khiến hàm này được trigger
    // Làm gì đó với dữ liệu response
    return response;
  }, function (error) {
    // Bất kì mã trạng thái nào lọt ra ngoài tầm 2xx đều khiến hàm này được trigger\
    // Làm gì đó với lỗi response
    return Promise.reject(error);
  });
  const api = axios
  export default api