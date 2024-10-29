import axios from "axios";

const convertir = axios.create({
    baseURL:'http://localhost:8000/convertir'
})

export const ConvertirVideo = (data) => convertir.post('', data)