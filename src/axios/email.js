import axios from "axios";
export const sendMail = async (data,email) => {
    const dataEmail = {
        service_id: 'service_9r0jf9r',
        template_id: 'template_2l0uhda',
        user_id: 'W4k5exh6DDd43OumV',
        template_params: {
            'to_email': email,
            'maGiamGia':data.ma,
            'soGiamGia':data.soTienGiam === null? data.phanTramGiamGia:data.soTienGiam,
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
