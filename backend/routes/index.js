var express = require("express");

// router is how we can access and respond to http client requests and methods
var router = express.Router();

// multer to handle file upload from frontend
const multer = require("multer");
// this makes sure we have a file upload path to refer to after file upload
const upload = multer({ dest: "uploads/" });

// csv parser module for turning csv to JSON
const csv = require("csv-parser");

// file system module
const fs = require("fs");
const { group } = require("console");
const results = [];

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

//will use multer to read the file that we have uploaded from the react frontend in the state called "file"
router.post("/upload", upload.single("file"), (req, res, next) => {
  res.send("hello Wave!");
  const filePath = req.file.path;
  const uploadTime = req._startTime;
  console.log(uploadTime);
  const fileName = req.file.originalname;
  // created variables to access JSON keys after file upload based on csv sheet's headers
  const hoursWorked = "hours worked";
  const employeeId = "employee id";
  const jobGroup = "job group";
  const groupAHourly = 20;
  const groupBHourly = 30;

  let reports = [];

  // file system module reads the path of the uploaded file (now stored in disk) and parses the csv file to json!
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      // pushes new data into the results array that will be holding the csv file in JSON form
      results.push(data);
      // console.log(results)
    })
    .on("end", () => {
      // shows us the newly added JSON objects!
      results.map((result) => {
        const dateRange = result.date;

        // formats date from DD/MM/YYYY to YYYY/MM/DD so JavaScript can read it
        const formattedDate = new Date(dateRange.split("/").reverse().join("/"))
          .toISOString()
          .slice(0, 10);

        // extract month from the formatted date
        const month = formattedDate.split("-")[1];

        // extract day from the formatted date
        const day = formattedDate.split("-")[2];

        // extract year from the formatted date
        const year = formattedDate.split("-")[0];

        // creating the report holding employee and payroll object
        const report = () => {
          return {
            employeeID: result[employeeId],
            payPeriod:
              day >= 1 && day <= 15
                ? {
                    startDate: `${year}-${month}-${1}`,
                    endDate: `${year}-${month}-${15}`,
                  }
                : {
                    startDate: `${year}-${month}-${16}`,
                    endDate:
                      // conditional to make sure the last day of the month is accurate
                      month == 01 ||
                      month == 03 ||
                      month == 05 ||
                      month == 07 ||
                      month == 08 ||
                      month == 10 ||
                      month == 12
                        ? `${year}-${month}-${31}`
                        : month == 02
                        ? `${year}-${month}-${28}`
                        : `${year}-${month}-${30}`,
                  },
            amountPaid: `$${
              result[jobGroup] === "A"
                ? result[hoursWorked] * groupAHourly
                : result[hoursWorked] * groupBHourly
            }`,
          };
        };

        reports.push(report());
      });

      // combine objects pased on employee ID and pay periods and call it Employee Reports
      const employeeReports = reports
        .map((index) =>
          Object({
            employeeID: index.employeeID,
            payPeriod: {
              startDate: index.payPeriod.startDate,
              endDate: index.payPeriod.endDate,
            },
            amountPaid: Number(index.amountPaid.substring(1)),
          })
        )
        .reduce((total, cur) => {
          const emp = total.find(
            (t) =>
              t.employeeID === cur.employeeID &&
              t.startDate === cur.payPeriod.startDate &&
              t.endDate === cur.payPeriod.endDate
          );
          if (emp) emp.amountPaid += cur.amountPaid;
          else
            total.push({
              employeeID: cur.employeeID,
              payPeriod: {
                startDate: cur.payPeriod.startDate,
                endDate: cur.payPeriod.endDate,
              },
              startDate: cur.payPeriod.startDate,
              endDate: cur.payPeriod.endDate,
              amountPaid: cur.amountPaid,
            });
          return total;
        }, []);

      employeeReports.map((obj) => {
        // deleting not-so-nested start and end dates from object
        delete obj.startDate;
        delete obj.endDate;
        // change the amount paid to proper currency
        obj.amountPaid = obj.amountPaid.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      });

      //  Sorting objects from employee ID & startDate
      employeeReports.sort(
        (a, b) => parseFloat(a.employeeID) - parseFloat(b.employeeID)
      );

      const payrollReports = JSON.stringify({ employeeReports })

      
      // view as table
      console.table(employeeReports)

      // view as JSON
      console.log({ payrollReports })


    });
});

module.exports = router;
