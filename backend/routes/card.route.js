import express from "express";
import {
  createCard,
  getMyCards,
  getCardById,
  updateCard,
  deleteCard,
} from "../controller/card.controller.js";
import verifyToken from "../middleware/verifyToken.js";
import upload from "../middleware/upload.js";

const router = express.Router();
router.post("/create", verifyToken, upload.single("profilePic"), createCard);
router.get("/list/:id", verifyToken, getMyCards);
router.get("/:id", getCardById);
router.put("/:id", verifyToken, upload.single("profilePic"), updateCard);
router.delete("/:id", verifyToken, deleteCard);

export default router;
