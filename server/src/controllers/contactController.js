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

export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['NEW', 'READ', 'RESPONDED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const updated = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.json({ success: true, message: 'Status updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ContactMessage.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

