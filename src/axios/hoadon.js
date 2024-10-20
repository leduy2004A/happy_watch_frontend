import api from "./axios";
export const addHoaDon = async () => {
  return await api.post("api/hoadon/add", {});
};
export const addSanPhamVaoHoaDon = async (data) => {
  const dataAdd = {
    hoaDon: {
      id: data.hoaDonId,
    },
    chiTietSanPham: {
      //gio add nhe
      id: data.chiTietSanPhamId,
    },
    soLuong: 1,
    giaTungSanPham: data.gia,
  };
  return await api.post("api/chitiethoadon/add",dataAdd);
};
export const getSanPhamTheoHoaDon = async(data)=>{
    return await api.get(`api/hoadon/all-sp?idHD=${data}`)
}
export const addSoLuongSanPham = async (data)=>{
    return await api.put(`api/chitiethoadon/congsl?idCTHD=${data}`)
}
export const truSoLuongSanPham = async (data)=>{
    return await api.put(`api/chitiethoadon/trusl?idCTHD=${data}`)
}
export const hienThiHoaDonChoThanhToan = async()=>{
    return await api.get("api/hoadon/cho-thanh-toan")
}
export const huyHoaDon = async(data)=>{
  return await api.put(`api/hoadon/cancel/${data}`)
}
export const xacNhanDonHang = async (data)=>{
  return await api.put(`/api/hoadon/confirm-with-address/${data.hoaDonId}?tinhThanhPho=${data.province}&quanHuyen=${data.district}&xaPhuongThiTran=${data.ward}&diaChiCuThe=${data.diaChiCuThe}&dienThoai=${data.dienThoai}`)
}