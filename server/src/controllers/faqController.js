import FAQ from '../models/FAQ.js';

export const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({ active: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: faqs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllFAQsAdmin = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: faqs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createFAQ = async (req, res) => {
  try {
    const { question, answer, category, order } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Question and answer are required' });
    }

    const faq = new FAQ({
      question,
      answer,
      category: category || 'General',
      order: order ? Number(order) : 0,
      active: true,
    });

    await faq.save();
    res.status(201).json({ success: true, message: 'FAQ created successfully', data: faq });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, message: 'FAQ updated', data: faq });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, message: 'FAQ deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
