import express from "express";
import { getAllUsers,getAllCardTemplates, deleteUser, deleteCardTemplate,addCardTemplate ,updateCardTemplate,getSingleCardTemplate, getSimpleCardTemplates} from "../controller/admin.controller.js";
import verifyToken from "../middleware/verifyToken.js";
import isAdmin from "../middleware/isAdmin.js";
import upload from "../middleware/upload.js";


const router = express.Router();

router.get("/users", verifyToken, isAdmin, getAllUsers);
router.delete("/user/:id", verifyToken, isAdmin, deleteUser);
router.post("/add-template", verifyToken, isAdmin, upload.single("templateImage"), addCardTemplate);
router.get("/card-templates",  getAllCardTemplates);
router.get("/simple-template",getSimpleCardTemplates);
router.get("/card-template/:id", getSingleCardTemplate); 
router.delete("/delete-template/:id", verifyToken, isAdmin, deleteCardTemplate);
router.put("/update-template/:id", verifyToken, isAdmin, updateCardTemplate);


export default router;
