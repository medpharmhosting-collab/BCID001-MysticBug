import { FAQ } from "../models/Faq.js";

export const getAllFaqs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    return res.status(200).json({
      success: true,
      message: faqs
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
export const addFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const count = await FAQ.countDocuments();

    if (count >= 10) {
      return res.status(400).json({
        success: false,
        message: "Cannot add more than 10 FAQs"
      });
    }
    const faq = await FAQ.create({ question, answer });
    return res.status(200).json({ success: true, message: faq });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    const faq = await FAQ.findByIdAndUpdate(
      id,
      { question, answer },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "FAQ updated successfully",
      faq
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    await FAQ.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "FAQ deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export const getFaqById = async (req, res) => {
  try {
    const { id } = req.params
    const response = await FAQ.findById(id)
    res.status(200).json({ success: true, message: response })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}