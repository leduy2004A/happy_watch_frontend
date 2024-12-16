import axios from "axios";
import api from "./axios";
export const sendMail = async (data,email) => {
    const dataEmail = {
        service_id: 'service_9r0jf9r',
        template_id: 'template_2l0uhda',
        user_id: 'W4k5exh6DDd43OumV',
        template_params: {
            'to_email': email,
            'maGiamGia':data.ma,
            'soGiamGia':data.soTienGiam === 0 ? data.phanTramGiamGia+'%' : data.soTienGiam,
            'ngayHieuLuc':data.ngayBatDau,
            'ngayHetHieuLuc':data.ngayKetThuc
        }
    };
  return await axios.post("https://api.emailjs.com/api/v1.0/email/send", dataEmail, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const sendMailTrangThai = async (data) => {
  const dataEmail = {
      service_id: 'service_9r0jf9r',
      template_id: 'template_1pdzgz7',
      user_id: 'W4k5exh6DDd43OumV',
      template_params: data
  };
return await axios.post("https://api.emailjs.com/api/v1.0/email/send", dataEmail, {
  headers: {
    "Content-Type": "application/json",
  },
});
};
export const layMailTuHoaDon = async (id) =>{
  return await api.get(`/api/hoadon/email/${id}`)
}
export const addMail = async (email,idHoaDon) =>{
  return await api.put(`/api/hoadon/add-email?email=${email}&maHoaDon=${idHoaDon}`)
}