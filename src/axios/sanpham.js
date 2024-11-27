import api from "./axios";
export const laySanPham =async ()=>{
   return await api.get("/api/sanpham/all")
}
export const laySanPhamCuaHang = async (page,size)=>{
   return await api.get(`/api/home/all-ctsp?page=${page}&size=${size}`)
}
export const laySanPhamKemSoLuong =async ()=>{
   return await api.get("/api/sanpham/tat-ca")
}
export const layTatCaGioiTinh =async ()=>{
   return await api.get("/api/gioi-tinh/all")
}
export const addGioiTinh =async (data)=>{
   return await api.post("/api/gioi-tinh/add",data)
}
export const layTatCaThuongHieu =async ()=>{
   return await api.get("/api/thuong-hieu/all")
}
export const addThuongHieu =async (data)=>{
   return await api.post("/api/thuong-hieu/add",data)
}
export const updateThuongHieu =async (data)=>{
   return await api.put("/api/thuong-hieu/update",data)
}

export const addSanPham =async (data)=>{
   return await api.post("api/san-pham/create",data)
}
export const layTatCaChiTietTheoSP =async (idSanPham)=>{
   return await api.get(`/api/chi-tiet-san-pham/chi-tiet-sp-id?idSanPham=${idSanPham}`)
}




export const layTatCaMauSac =async ()=>{
   return await api.get("/api/mau-sac/all")
}
export const addMauSac =async (data)=>{
   return await api.post("/api/mau-sac/add",data)
}
export const updateMauSac =async (data)=>{
   return await api.put("/api/mau-sac/update",data)
}

export const layTatCaLoaiMay =async ()=>{
   return await api.get("/api/loai-may")
}
export const addLoaiMay =async (data)=>{
   return await api.post("/api/loai-may",data)
}

export const updateLoaiMay =async (data)=>{
   return await api.put(`/api/loai-may/${data.id}`,data)
}

export const layTatCaChatLieuVo =async ()=>{
   return await api.get("/api/chat-lieu-vo/all")
}
export const addChatLieuVo =async (data)=>{
   return await api.post("/api/chat-lieu-vo/add",data)
}
export const updateChatLieuVo =async (data)=>{
   return await api.put("/api/chat-lieu-vo/update",data)
}
export const layTatCaChatLieuDay =async ()=>{
   return await api.get("/api/chat-lieu-day/all")
}
export const addChatLieuDay =async (data)=>{
   return await api.post("/api/chat-lieu-day/add",data)
}
export const updateChatLieuDay =async (data)=>{
   return await api.put("/api/chat-lieu-day/update",data)
}
export const layTatCaLoaiKinh =async ()=>{
   return await api.get("/api/loai-kinh")
}
export const addLoaiKinh =async (data)=>{
   return await api.post("/api/loai-kinh",data)
}
export const updateLoaiKinh =async (data)=>{
   return await api.put(`/api/loai-kinh/${data.id}`,data)
}
export const layTatCaHinhDang =async ()=>{
   return await api.get("/api/hinh-dang")
}
export const addHinhDang =async (data)=>{
   return await api.post("/api/hinh-dang",data)
}
export const updateHinhDang =async (data)=>{
   return await api.put(`/api/hinh-dang/${data.id}`,data)
}
export const themChiTietSanPham =async (data)=>{
   return await api.post("/api/chi-tiet-san-pham/add",data)
}
export const layChiTietSanPham =async (data)=>{
   return await api.get(`/api/chi-tiet-san-pham/chi-tiet-list-anh?id=${data}`)
}
export const updateChiTietSanPham =async (data)=>{
   return await api.put(`/api/chi-tiet-san-pham/update/${data.id}`,data)
}
export const layTatCaKhachHang =async ()=>{
   return await api.get(`/api/khach-hang`)
}
export const themKhachHang =async (data)=>{
   return await api.post(`/api/khach-hang`,data)
}
export const updateKhachHang =async (data)=>{
   return await api.put(`/api/khach-hang/${data.id}`,data)
}
export const getNhanVien = async () =>{
   return await api.get(`/api/admin`)
}