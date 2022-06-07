const { sendStatus } = require('express/lib/response');
const Doctor = require('../models/doctor');
const Patients = require('../models/patients.js');
const Reports = require('../models/reports');
const { verify } = require('jsonwebtoken');
const jwt = require('jsonwebtoken');
//Doctors Register
module.exports.DoctorRegister = async function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.json({
      Error: 'password do not match!',
    });
  }
  try {
    let DoctorInfo = await Doctor.create(req.body);
    return res.json({
      message: 'Docter created',
      data: DoctorInfo,
    });
  } catch (error) {
    res.json({
      Error: 'error creating',
    });
  }
};
//Doctors Login
module.exports.DoctorLogin = async function (req, res) {
  try {
    const userName = req.body.username;
    const userPass = req.body.password;

    let docData = await Doctor.find({ username: userName });
    console.log('docData: ', docData);
    if (docData) {
      if (docData[0].password == userPass) {
        //jwt creation
        const token = jwt.sign(
          { id: docData[0].id, username: docData[0].username },
          'secretkey'
        );
        res.json({
          status: 'logged in',
          data: docData,
          jwtToken: token,
        });
      } else {
        res.json({
          status: 'error logging in',
          Errors: 'password did not match',
        });
      }
    }
  } catch (error) {
    res.json({
      Error: 'error while logging',
    });
  }
};
//Patients Register
module.exports.PatientRegister = async function (req, res) {
  try {
    let PatientInfo = await Patients.create(req.body);
    console.log('patient-info :', PatientInfo);
    res.json({
      status: 'patient registered',
      data: PatientInfo,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: 'error while registering',
    });
  }
};
//patient create report

module.exports.CreatePatientReport = async function (req, res) {
  try {
    const { status } = req.body;
    const patient = req.params.id;
    const doctor = req.doctor.id;
    console.log('doctor id:', doctor);
    const patientDetails = await Patients.findById(patient);
    console.log('patients Detailes: ', patientDetails);

    const report = await Reports.create({
      status,
      doctor,
      patient,
    });
    patientDetails.report.push(report);
    patientDetails.save();
    //returning the response

    return res.status(201).json({
      success: true,
      body: report,
      msg: 'Report Created Successfully',
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Error Occupied',
    });
  }
};
//Patient All reports
module.exports.allReports = async function (req, res) {
  try {
    const reports = await Patients.findById(req.params.id).populate({
      path: 'report',
      populate: { path: 'doctor' },
    });
    console.log('reports uu:', reports);
    let reportsObj = {};
    reportsObj.patient_name = reports.name;
    reportsObj.phone = reports.phone;
    reportsObj.reports = [];

    for (let i = 0; i < reports.report.length; i++) {
      reportsObj.reports.push({
        doctor: reports.report[i].doctor.username,
        status: reports.report[i].status,
      });
    }

    //return response
    return res.status(200).json({
      success: true,
      body: reportsObj,
      msg: 'All reports oof the patient',
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'All reports cannot be fetched',
    });
  }
};
//by status
module.exports.ReportsByStatus = async function (req, res) {
  try {
    if (
      req.params.status != 'Negative' &&
      req.params.status != 'Travelled-Quarantine' &&
      req.params.status != 'Symptoms-Quarantine' &&
      req.params.status != 'Positive-Admit'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect status',
        Available_statuses:
          'Negative, Travelled-Quarantine, Symptoms-Quarantine Positive-Admit',
      });
    }

    const reportByStatus = await Reports.find({ status: req.params.status })
      .populate('patient')
      .populate('doctor');

    //res object
    let result = {};
    result.caseCount = reportByStatus.length;
    let ans = [];
    for (let i = 0; i < reportByStatus.length; i++) {
      let patient = {};
      patient.name = reportByStatus[i].patient.name;
      patient.phone = reportByStatus[i].patient.phone;
      ans.push({
        doctor: reportByStatus[i].doctor.name,
        patient: patient,
      });
    }
    result.report = ans;
    return res.status(200).json({
      success: true,
      body: result,
      msg: 'All reports with status!',
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'All reports by status cannot be fetched',
    });
  }
};

//authentication JWT
module.exports.checkAuth = async function (req, res, next) {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorixzed access-no token',
    });
  }
  try {
    console.log('token :', token);
    const decoded = jwt.verify(token, 'secretkey');

    console.log('decoded :', decoded);

    req.doctor = await Doctor.findById(decoded.id);

    console.log('req doctor :', req.doctor);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorixzed access-error',
    });
  }
};
