import { Feedback } from "../models/doctorFeedback.js"
export const createFeedback = async (req, res) => {
  try {
    const { doctor, rating, feedback, patientName, patientEmail } = req.body;

    if (!doctor || !rating || !feedback) {
      return res.status(400).json({ message: 'Doctor, rating, and feedback are required' });
    }

    const newFeedback = new Feedback({
      doctor,
      rating,
      feedback,
      patientName,
      patientEmail,
      date: new Date()
    });

    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export const fetchFeedbacksForSpecificDoctor = async (req, res) => {
  try {
    const { doctor } = req.query;

    if (!doctor) {
      return res.status(400).json({ message: 'Doctor name is required' });
    }

    const feedbacks = await Feedback.find({ doctor })
      .sort({ date: -1 }) // Latest first
      .lean();

    // Calculate average rating
    const avgRating = feedbacks.length > 0
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
      : 0;

    res.status(200).json({
      doctor,
      averageRating: parseFloat(avgRating),
      totalReviews: feedbacks.length,
      reviews: feedbacks
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export const fetchAggregateRatingsForAllDoctors = async (req, res) => {
  try {
    const ratings = await Feedback.aggregate([
      {
        $group: {
          _id: '$doctor',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      },
      {
        $project: {
          doctor: '$_id',
          averageRating: { $round: ['$averageRating', 1] },
          totalReviews: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json({ ratings });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export const likedFeedback = async (req, res) => {
  try {
    // Step 1: Get userId from request body
    const userId = req.body.userId;
    if (!userId) return res.status(400).json({ message: "UserId is required" });

    // Step 2: Find the review by ID
    const review = await Feedback.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Step 3: Check if user already liked
    const alreadyLiked = review.likedBy.includes(userId);

    if (alreadyLiked) {
      // Step 4a: If already liked, you can either ignore or undo like
      return res.status(400).json({ message: "User already liked this review" });
    }

    // Step 4b: If user had disliked before, remove dislike
    if (review.dislikedBy.includes(userId)) {
      review.dislikedBy = review.dislikedBy.filter((id) => id !== userId);
      review.disLikes -= 1;
    }

    // Step 5: Add user to likedBy array
    review.likedBy.push(userId);
    review.likes += 1;

    // Step 6: Save updated review
    await review.save();

    // Step 7: Return updated review
    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update like" });
  }
}

export const disLikeFeedback = async (req, res) => {
  try {
    // Step 1: Get userId from request body
    const userId = req.body.userId;
    if (!userId) return res.status(400).json({ message: "UserId is required" });

    // Step 2: Find the review by ID
    const review = await Feedback.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Step 3: Check if user already disliked
    const alreadyDisliked = review.dislikedBy.includes(userId);

    if (alreadyDisliked) {
      // Step 4a: If already disliked, ignore or undo
      return res.status(400).json({ message: "User already disliked this review" });
    }

    // Step 4b: If user had liked before, remove like
    if (review.likedBy.includes(userId)) {
      review.likedBy = review.likedBy.filter((id) => id !== userId);
      review.likes -= 1;
    }

    // Step 5: Add user to dislikedBy array
    review.dislikedBy.push(userId);
    review.disLikes += 1;

    // Step 6: Save updated review
    await review.save();

    // Step 7: Return updated review
    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update dislike" });
  }
}