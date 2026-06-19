const express = require('express');
const router = express.Router();
const Request = require('../models/Request');

// 1. CREATE NEW INTERVIEW REQUEST (CANDIDATE BROADCAST)
router.post('/create', async (req, res) => {
  try {
    const { candidateId, candidateName, companyApplied, stream, interestedSlot, originalSlot } = req.body;

    const newRequest = new Request({
      candidateId,
      candidateName,
      companyApplied,
      stream,
      interestedSlot,
      originalSlot
    });

    await newRequest.save();
    res.status(201).json({ success: true, message: 'Request broadcasted to pool successfully!', data: newRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create request.', error: error.message });
  }
});

// 2. GET ALL PENDING REQUESTS (FOR HR POOL)
router.get('/pool', async (req, res) => {
  try {
    const openPool = await Request.find({ status: 'pending' });
    res.status(200).json({ success: true, data: openPool });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving pool.', error: error.message });
  }
});

// 3. GET CANDIDATE'S SPECIFIC HISTORY (BY ID)
router.get('/candidate/:id', async (req, res) => {
  try {
    const history = await Request.find({ candidateId: req.params.id });
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching history.', error: error.message });
  }
});

// 4. GET STUCK REQUESTS (SITTING LONGER THAN 48 HOURS FOR ADMIN)
router.get('/admin/stuck', async (req, res) => {
  try {
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const stuckRequests = await Request.find({
      status: 'pending',
      createdAt: { $lte: twoDaysAgo }
    });
    res.status(200).json({ success: true, data: stuckRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error loading safety queue.', error: error.message });
  }
});

// 5. CLAIM AN INTERVIEW SESSION (PUT INTERACTION CALLED FROM HR DASHBOARD)
router.put('/claim/:id', async (req, res) => {
  try {
    const { interviewerId } = req.body;

    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.id,
      {
        interviewerId,
        status: 'accepted',
        meetLink: 'https://meet.google.com/abc-defg-hij' // Generate a dummy meet link target
      },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: 'Request target instance not found.' });
    }

    res.status(200).json({ success: true, message: 'Session locked successfully!', data: updatedRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process claim request status change.', error: error.message });
  }
});

module.exports = router;