import ContactMessage from '../models/ContactMessage.js';

export const submitContactMessage = async (req, res) => {
  try {
    const { fullName, email, phone, message } = req.body;
    if (!fullName || !email || !phone || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const contact = new ContactMessage({ fullName, email, phone, message });
    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Thank you for connecting! Our team will contact you shortly.',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getContactMessagesAdmin = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
