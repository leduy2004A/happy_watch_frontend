import axios from "axios";
axios.interceptors.request.use(function (config) {
    config.baseURL = "http://localhost:8080"
    // Làm gì đó trước khi request dược gửi đi
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImRraWxsZXI2IiwiaWQiOjcsImV4cCI6MTczMTk0MjY0ODM1Nn0.iftvRcsNbTZ7GYDS2U9JyNfJvS7wmeKvB4TnQ6abny8';

    // Nếu token tồn tại, thêm nó vào header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, function (error) {
    // Làm gì đó với lỗi request
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