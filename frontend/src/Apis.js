// // src/Apis.js

const BASE_URL = "http://localhost:5000";

const Apis = {
  BASE_URL, // Base URL ka ek hi variable, sab endpoints me use

  // Authentication
  SIGN_UP: `${BASE_URL}/user/sign-up`,
  SIGN_IN: `${BASE_URL}/user/sign-in`,
  FORGOT_PASSWORD: `${BASE_URL}/user/forgot-password`,
  VERIFY_OTP: `${BASE_URL}/user/verify-otp`,
  RESET_PASSWORD: `${BASE_URL}/user/reset-password`,
  FIREBASE_LOGIN: `${BASE_URL}/firebase-login`,

  // User Cards
  CREATE_CARD: `${BASE_URL}/card/create`,
  GET_MY_CARDS: `${BASE_URL}/card/list`,
  DELETE_CARD: `${BASE_URL}/card`,          
  GET_CARD_BY_ID: `${BASE_URL}/card`,      

  // User Profile
  GET_USER_PROFILE: `${BASE_URL}/profile`,
  UPDATE_USER_PROFILE: `${BASE_URL}/profile`,
  UPLOAD_PROFILE_PIC: `${BASE_URL}/user/middleware-profile-pic`,

  // Admin
  DELETE_USER: `${BASE_URL}/admin/user`,            
  MANAGE_USERS: `${BASE_URL}/admin/users`,
  MANAGE_CARDS: `${BASE_URL}/admin/manage-template`,
  DELETE_CARD_TEMPLATE: `${BASE_URL}/admin/delete-template`,
  ADD_CARD_TEMPLATE: `${BASE_URL}/admin/add-template`,
  ADMIN_GET_TEMPLATES: `${BASE_URL}/admin/card-templates`,
  ADMIN_UPDATE_TEMPLATE: `${BASE_URL}/admin/update-template`,     
  ADMIN_GET_TEMPLATE_BY_ID: `${BASE_URL}/admin/card-template`,    

  // Dashboard templates
  DASHBOARD_TEMPLATES: `${BASE_URL}/admin/simple-template`,

  // Contact & About
  CONTACT_US: `${BASE_URL}/contact`,
  ABOUT_US: `${BASE_URL}/about`,
};

export default Apis;
