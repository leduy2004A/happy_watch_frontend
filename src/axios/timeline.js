import api from "./axios";
export const chuyenTrangThai = async (data) => {
  return await api.put(
    `http://localhost:8080/api/qlhd/cap-nhat-trang-thai/${data.maHoaDon}?ghiChu=${data.ghiChu}`
  );
};
export const quayLaiTrangThai = async (data) => {
  return await api.put(
    `http://localhost:8080/api/qlhd/quay-lai-trang-thai/${data.maHoaDon}?ghiChu=${data.ghiChu}`
  );
};