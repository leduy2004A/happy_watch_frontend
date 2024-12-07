import api from "./axios";
export const getComBoBoxThuongHieu = async ()=>{
    return await api.get("/api/combobox/thuong-hieu");
}
export const getComBoBoxMauSac= async ()=>{
    return await api.get("/api/combobox/mau-sac");
}
export const getComBoBoxHinhDang = async ()=>{
    return await api.get("/api/combobox/hinh-dang");
}
export const getComBoBoxLoaiMay= async ()=>{
    return await api.get("/api/combobox/loai-may");
}
export const getComBoBoxChatLieuVo= async ()=>{
    return await api.get("/api/combobox/chat-lieu-vo");
}
export const getComBoBoxChatLieuDay = async ()=>{
    return await api.get("/api/combobox/chat-lieu-day");
}
export const getComBoBoxLoaiKinh= async ()=>{
    return await api.get("/api/combobox/loai-kinh");
}