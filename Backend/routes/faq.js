import { addFaq, deleteFaq, getAllFaqs, getFaqById, updateFaq } from "../controllers/faq.js";
import express from "express";
export const FaqRoutes = express.Router();

// GET ALL FAQ
FaqRoutes.get('/', getAllFaqs);

// ADD FAQ
FaqRoutes.post('/', addFaq);

// UPDATE FAQ
FaqRoutes.put('/:id', updateFaq);

// DELETE FAQ
FaqRoutes.delete('/:id', deleteFaq);

// get FAQ by id
FaqRoutes.get('/:id', getFaqById)
