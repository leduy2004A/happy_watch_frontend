import api from "./axios";
export const getAllHoaDon = async ()=>{
    return await api.get("api/qlhd/all-hd");
}
export const getHoaDonTheoMa = async (maHoaDon)=>{
    return await api.get(`api/qlhd/hoa-don/${maHoaDon}`);
}
export const layTrangThaiHoadonTheoMa = async (maHoaDon)=>{
    return await api.get(`api/qlhd/trang-thai/${maHoaDon}`);
}
export const layDanhSachSanPhamTheoMaHoaDon = async (maHoaDon) =>{
    return await api.get(`api/hoadon/all-sp-ma?maHD=${maHoaDon}`)
}
export const layPhiHoaDon = async (maHoaDon) =>{
    return await api.get(`api/hoadon/thong-tin?maHoaDon=${maHoaDon}`)
}
export const congSlSanPham = async (idCTHD) =>{
    return await api.put(`api/chitiethoadon/congsl?idCTHD=${idCTHD}`)
}

export const layHoaDonTheoNguoiDung = async()=>{
    return await api.get('api/khach-hang/hoa-don')
}
export const thongTinGiaoHang = async(maHoaDon)=>{
    return await api.get(`api/khach-hang/diachinhanhang/${maHoaDon}`)
}
export const updateDiaChiNhanHangTheoMaHoaDon = async(maHoaDon,data)=>{
    return await api.put(`api/qlhd/update-dia-chi-nhan-hang/${maHoaDon}`,data)
}
export const capNhatPhiShipTheoMaHoaDon = async(maHoaDon,phiShip)=>{
    return await api.put(`api/hoadon/phi-ship/${maHoaDon}`,{phiShip:phiShip})
}

export const traHang = async(data)=>{
    return await api.post(`api/tra-hang/yeu-cau-tra-hang`,data)
}

export const layTraHang = async(data)=>{
    return await api.get(`api/tra-hang/by-ma-hoa-don/${data}`)
}