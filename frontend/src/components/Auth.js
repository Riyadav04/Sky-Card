import { Navigate } from "react-router-dom";

export const isLoggedIn = ()=>{
  return !!sessionStorage.getItem("isLoggedIn"); // "true" --> false --> true
}
function Auth({children}){
   if(isLoggedIn())    
     return children;
   else
    return <Navigate to="/sign-in"/> 
}

export default Auth;