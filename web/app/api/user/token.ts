
export default function  userToken(){
return  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
}


