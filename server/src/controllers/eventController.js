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
        eventDate: new Date('2026-12-20T06:00:00.000+05:30'),
        eventTime: '6:00 AM onwards',
        organizers: ['Chinmaya Mission Adoni', 'Chinmaya Yuva Kendra Adoni'],
        registrationOpen: true,
        registrationEndDate: new Date('2026-11-30T23:59:59.000+05:30'),
      });
    } else if (!config.registrationEndDate || new Date(config.registrationEndDate).getMonth() === 11) {
      config.registrationEndDate = new Date('2026-11-30T23:59:59.000+05:30');
      await config.save();
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
