import api from "./axios";
export const thanhtoan = async (data) => {
  console.log(data);
  return await api.put(
    `http://localhost:8080/api/hoadon/update-status/${data.hoaDonId}?tienKhachDua=${data.tienKhachDua}&phuongThuc=${data.phuongThuc}&gia=${data.gia}&maGiaoDich=${data.maGiaoDich}&maKhuyenMaiHoaDon=${data.maKhuyenMaiHoaDon}`
  );
};
export const thanhToanMuaNgay = async (data) => {
    return await api.post(
        `http://localhost:8080/api/hoadon/xac-nhan-mua-ngay`,data
      );
};
export const thanhToanNgay = async (data) => {
  return await api.post(
      `api/thanh-toan/thanh-toan-ngay`,data
    );
};
export const thanhToanMuaNgayV2 = async (data) => {
  return await api.post(
      `api/hoadon/thanh-toan-mua-ngay?maHoaDon=${data.maHoaDon}`,{soTien: data.soTien,phuongThuc:data.phuongThuc}
    );
};
