export default function  userID(){
return  typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
}
