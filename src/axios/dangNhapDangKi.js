import axios from "axios";
export const dangNhap = async (data)=>{
    return await axios.get("http://localhost:8080/api/user/login",data);
}
export const dangKi= async (data)=>{
    return await axios.get("http://localhost:8080/api/user/register",data);
}