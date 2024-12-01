import axios from "axios";
import api from "./axios";
export const dangNhap = async (data)=>{
    return await axios.post("http://localhost:8080/api/user/login",data);
}
export const dangKi= async (data)=>{
    return await axios.get("http://localhost:8080/api/user/register",data);
}
export const layThongTinNguoiDung = async()=>{
    return await api.get("/api/khach-hang/hien-thi-theo-token")
}