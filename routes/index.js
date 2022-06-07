const express = require('express');
const router = express.Router();

const allControllers = require('../controllers/userController');
const { checkAuth } = require('../controllers/userController');
//--routes
router.post('/doctors/login', allControllers.DoctorLogin);
router.post('/doctors/register', allControllers.DoctorRegister);
router.post('/patients/register', checkAuth, allControllers.PatientRegister);
router.post(
  '/patients/:id/create_report',
  checkAuth,
  allControllers.CreatePatientReport
);
router.get('/patients/:id/all_reports', allControllers.allReports);
router.get('/reports/:status', allControllers.ReportsByStatus);
module.exports = router;
