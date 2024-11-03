import api from "./axios";
export const layChiTietSanPham =async (data)=>{

    return await api.get(`/api/home/id/${data}`)
}
export const layChiTietSanPhamCungLoai = async (data) =>{
    return await api.get(`http://localhost:8080/api/home/chi-tiet/${data}`)
}