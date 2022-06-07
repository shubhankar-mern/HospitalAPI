# HospitalAPI
About
-----
**API for Doctors of a Hospital which has been allocated by the govt. for testing, quarantine as well as well being of COVID-19 patients.
*Setup the Project
--------------------
 *1.Clone or Download the Repo.
 *2.Run mongod to start the MongoDB Database.
 *3.Run nodemon index.js to ignite the project.
 *4.Use Postman to test the api.

*Routes
-------
Register a Doctor: [POST]: /doctors/register
Login for Doctor: [POST]: /doctors/login
Register a patient: [POST]: /patients/register
Create Patient report: [POST]: /patients/:id/create_report
Fetch All Reports of a Patient [GET]: /patients/:id/all_reports
Fetch All Reports Based on a Status: [GET]: /reports/:status
