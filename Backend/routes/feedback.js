import { createFeedback, disLikeFeedback, fetchAggregateRatingsForAllDoctors, fetchFeedbacksForSpecificDoctor, likedFeedback } from "../controllers/feedback.js";
import express from "express";

export const feedbackRouter = express.Router();

// POST - Submit new feedback
feedbackRouter.post('/feedback', createFeedback);

// GET - Fetch all feedback for a specific doctor
feedbackRouter.get('/feedback', fetchFeedbacksForSpecificDoctor);

// GET - Fetch aggregate ratings for all doctors (for doctor list)
feedbackRouter.get('/feedback/ratings', fetchAggregateRatingsForAllDoctors);

// PUT /feedback/:id/like
feedbackRouter.put("/feedback/:id/like", likedFeedback);

// PUT /feedback/:id/dislike
feedbackRouter.put("/feedback/:id/dislike", disLikeFeedback);
