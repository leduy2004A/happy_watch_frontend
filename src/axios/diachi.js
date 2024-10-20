import api from "./axios";
import axios from "axios";
export const getdiachiTheoKhachHang = async(data)=>{
    return await api.get(`http://localhost:8080/api/khach-hang/dia-chi/first/${data}`)
}
export const getTinhThanh = async()=>{
    return await axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/province",{
        headers: {
            'Content-Type': 'application/json',
            'Token': '371dc38e-8dcb-11ef-b71a-5e14478acdc2'
        }
    })
}
export const getQuanHuyen = async(quanHuyenId)=>{
    return await axios.post(
        'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
        {
          province_id: quanHuyenId
        },
        {
          headers: {
            'token': '371dc38e-8dcb-11ef-b71a-5e14478acdc2',
            'Content-Type': 'application/json'
          }
        }
      );
}
export const getPhuongXa= async(diaChiId)=>{
    return await axios.post(
        'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id',
        {
            district_id: diaChiId
        },
        {
          headers: {
            'token': '371dc38e-8dcb-11ef-b71a-5e14478acdc2',
            'Content-Type': 'application/json'
          }
        }
      );
}