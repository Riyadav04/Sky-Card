import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./components/HomePage/Home";
import SignUp from "./components/user-authentication/SignUp";
import SignIn from "./components/user-authentication/SignIn";
import About from "./components/About/About.js";
import Contact from "./components/Contact/Contact.js";
import ForgotPassword from "./components/user-authentication/Forgotpassword";
import SignOut from "./components/user-authentication/SignOut";
// import VerifiedSuccess from "./components/VerifiedSuccess";
import ManageUsers from "./components/Admin/ManageUser/ManageUsers.js";
import ManageTemplate from "./components/Admin/Manage Template/ManageTemplate.js";
import SelectCard from "./components/SelectedCard/SelectCard.js";
import PreviewCard from "./components/PreviewCard/PreviewCard.js";
import AddTemplate from "./components/Admin/AddTemplate/AddTemplate.js";
import CustomizeTemplate from "./components/Admin/Customize/CustomizeTemplate.js";
import UserProfile from "./components/ViewProfile/viewProfile.js";
import EditProfile from "./components/ViewProfile/editProfile.js";
import AdminDashboard from "./components/Admin/Admin-Dashboard/Admin-Dashboard.js";
import MyCards from "./components/UserCard/MyCards.js";
import EditCard from "./components/UserCard/EditCard.js";
import FillForm from "./components/Form/FillForm.js";

function App() {
  return (
    <>
      <Routes>
        {/* user Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/edit-profile" element={<EditProfile />}></Route>
        <Route path="/sign-out" element={<SignOut />}></Route>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/fillform/:cardId" element={<FillForm />} />
        {/* <Route path="/verified-success" element={<VerifiedSuccess />} /> */}
        <Route path="/select-card/:cardId" element={<SelectCard />} />
        <Route path="/select-card" element={<SelectCard />} />
        {/* <Route path="/select-card" element={<SelectCard />} /> */}
        <Route path="/preview/:cardId" element={<PreviewCard />} />
        <Route path="/my-cards" element={<MyCards />} />
        <Route path="/edit-card/:id" element={<EditCard />} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/manage-template" element={<ManageTemplate />} />
        <Route path="/admin/add-template" element={<AddTemplate />} />
        <Route
          path="/admin/customize-template/:id"
          element={<CustomizeTemplate />}
        />
      </Routes>
    </>
  );
}

export default App;
