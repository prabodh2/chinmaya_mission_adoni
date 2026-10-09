import ContactMessage from '../models/ContactMessage.js';

export const submitContactMessage = async (req, res) => {
  try {
    const { fullName, email, phone, category, message } = req.body;
    if (!fullName || !email || !phone || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const contact = new ContactMessage({
      userId: req.user ? req.user._id : null,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      category: category ? category.trim() : 'General Inquiry',
      message: message.trim(),
      status: 'NEW',
    });
    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Thank you for connecting! Your message has been received.',
      data: contact,
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

export const getUserContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({
      $or: [{ userId: req.user._id }, { phone: req.user.phone }],
    }).sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
