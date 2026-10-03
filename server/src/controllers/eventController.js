import EventConfig from '../models/EventConfig.js';

export const getEventConfig = async (req, res) => {
  try {
    let config = await EventConfig.findOne();
    if (!config) {
      config = await EventConfig.create({
        programName: 'ANTI-DRUG MOVEMENT MARATHON RUN 2026',
        slogan: 'YOUR LIFE. YOUR CHOICE.',
        subSlogan: 'Run for a Drug-Free Future',
        location: 'Adoni, Andhra Pradesh, India',
        venue: 'Chinmaya Mission Adoni',
        eventDate: new Date('2026-12-06T06:00:00.000+05:30'),
        eventTime: '6:00 AM onwards',
        organizers: ['Chinmaya Mission Adoni', 'Chinmaya Yuva Kendra Adoni'],
        registrationOpen: true,
      });
    }
    res.json({ success: true, data: config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateEventConfig = async (req, res) => {
  try {
    let config = await EventConfig.findOne();
    if (!config) {
      config = new EventConfig(req.body);
    } else {
      Object.assign(config, req.body);
    }
    await config.save();
    res.json({
      success: true,
      message: 'Event configuration updated successfully',
      data: config,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
