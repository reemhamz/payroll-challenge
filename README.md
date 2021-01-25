# Wave Software Development Challenge (View Reem's commit at the bottom of this README)

Applicants for the Full-stack Developer role at Wave must
complete the following challenge, and submit a solution prior to the onsite
interview.

The purpose of this exercise is to create something that we can work on
together during the onsite. We do this so that you get a chance to collaborate
with Wavers during the interview in a situation where you know something better
than us (it's your code, after all!)

There isn't a hard deadline for this exercise; take as long as you need to
complete it. However, in terms of total time spent actively working on the
challenge, we ask that you not spend more than a few hours, as we value your
time and are happy to leave things open to discussion in the on-site interview.

Please use whatever programming language and framework you feel the most
comfortable with.

Feel free to email [dev.careers@waveapps.com](dev.careers@waveapps.com) if you
have any questions.

## Project Description

Imagine that this is the early days of Wave's history, and that we are prototyping a new payroll system API. A front end (that hasn't been developed yet, but will likely be a single page application) is going to use our API to achieve two goals:

1. Upload a CSV file containing data on the number of hours worked per day per employee
1. Retrieve a report detailing how much each employee should be paid in each _pay period_

All employees are paid by the hour (there are no salaried employees.) Employees belong to one of two _job groups_ which determine their wages; job group A is paid $20/hr, and job group B is paid $30/hr. Each employee is identified by a string called an "employee id" that is globally unique in our system.

Hours are tracked per employee, per day in comma-separated value files (CSV).
Each individual CSV file is known as a "time report", and will contain:

1. A header, denoting the columns in the sheet (`date`, `hours worked`,
   `employee id`, `job group`)
1. 0 or more data rows

In addition, the file name should be of the format `time-report-x.csv`,
where `x` is the ID of the time report represented as an integer. For example, `time-report-42.csv` would represent a report with an ID of `42`.

You can assume that:

1. Columns will always be in that order.
1. There will always be data in each column and the number of hours worked will always be greater than 0.
1. There will always be a well-formed header line.
1. There will always be a well-formed file name.

A sample input file named `time-report-42.csv` is included in this repo.

### What your API must do:

We've agreed to build an API with the following endpoints to serve HTTP requests:

1. An endpoint for uploading a file.

   - This file will conform to the CSV specifications outlined in the previous section.
   - Upon upload, the timekeeping information within the file must be stored to a database for archival purposes.
   - If an attempt is made to upload a file with the same report ID as a previously uploaded file, this upload should fail with an error message indicating that this is not allowed.

1. An endpoint for retrieving a payroll report structured in the following way:

   _NOTE:_ It is not the responsibility of the API to return HTML, as we will delegate the visual layout and redering to the front end. The expectation is that this API will only return JSON data.

   - Return a JSON object `payrollReport`.
   - `payrollReport` will have a single field, `employeeReports`, containing a list of objects with fields `employeeId`, `payPeriod`, and `amountPaid`.
   - The `payPeriod` field is an object containing a date interval that is roughly biweekly. Each month has two pay periods; the _first half_ is from the 1st to the 15th inclusive, and the _second half_ is from the 16th to the end of the month, inclusive. `payPeriod` will have two fields to represent this interval: `startDate` and `endDate`.
   - Each employee should have a single object in `employeeReports` for each pay period that they have recorded hours worked. The `amountPaid` field should contain the sum of the hours worked in that pay period multiplied by the hourly rate for their job group.
   - If an employee was not paid in a specific pay period, there should not be an object in `employeeReports` for that employee + pay period combination.
   - The report should be sorted in some sensical order (e.g. sorted by employee id and then pay period start.)
   - The report should be based on all _of the data_ across _all of the uploaded time reports_, for all time.

   As an example, given the upload of a sample file with the following data:

    <table>
    <tr>
      <th>
        date
      </th>
      <th>
        hours worked
      </th>
      <th>
        employee id
      </th>
      <th>
        job group
      </th>
    </tr>
    <tr>
      <td>
        2020-01-04
      </td>
      <td>
        10
      </td>
      <td>
        1
      </td>
      <td>
        A
      </td>
    </tr>
    <tr>
      <td>
        2020-01-14
      </td>
      <td>
        5
      </td>
      <td>
        1
      </td>
      <td>
        A
      </td>
    </tr>
    <tr>
      <td>
        2020-01-20
      </td>
      <td>
        3
      </td>
      <td>
        2
      </td>
      <td>
        B
      </td>
    </tr>
    <tr>
      <td>
        2020-01-20
      </td>
      <td>
        4
      </td>
      <td>
        1
      </td>
      <td>
        A
      </td>
    </tr>
    </table>

   A request to the report endpoint should return the following JSON response:

   ```javascript
   {
     payrollReport: {
       employeeReports: [
         {
           employeeId: 1,
           payPeriod: {
             startDate: "2020-01-01",
             endDate: "2020-01-15"
           },
           amountPaid: "$300.00"
         },
         {
           employeeId: 1,
           payPeriod: {
             startDate: "2020-01-16",
             endDate: "2020-01-31"
           },
           amountPaid: "$80.00"
         },
         {
           employeeId: 2,
           payPeriod: {
             startDate: "2020-01-16",
             endDate: "2020-01-31"
           },
           amountPaid: "$90.00"
         }
       ];
     }
   }
   ```

We consider ourselves to be language agnostic here at Wave, so feel free to use any combination of technologies you see fit to both meet the requirements and showcase your skills. We only ask that your submission:

- Is easy to set up
- Can run on either a Linux or Mac OS X developer machine
- Does not require any non open-source software

### Documentation:

Please commit the following to this `README.md`:

1. Instructions on how to build/run your application
1. Answers to the following questions:
   - How did you test that your implementation was correct?
   - If this application was destined for a production environment, what would you add or change?
   - What compromises did you have to make as a result of the time constraints of this challenge?

## Submission Instructions

1. Clone the repository.
1. Complete your project as described above within your local repository.
1. Ensure everything you want to commit is committed.
1. Create a git bundle: `git bundle create your_name.bundle --all`
1. Email the bundle file to [dev.careers@waveapps.com](dev.careers@waveapps.com) and CC the recruiter you have been in contact with.

## Evaluation

Evaluation of your submission will be based on the following criteria.

1. Did you follow the instructions for submission?
1. Did you complete the steps outlined in the _Documentation_ section?
1. Were models/entities and other components easily identifiable to the
   reviewer?
1. What design decisions did you make when designing your models/entities? Are
   they explained?
1. Did you separate any concerns in your application? Why or why not?
1. Does your solution use appropriate data types for the problem as described?

# Reem's README:

Hi there! Thanks for giving me the opportunity to work on this challenge. Below you'll find the instructions on how to run and answers to your questions.

## Instructions on running it 
1. Running is super easy. All you'll have to do is `cd` into the `backend` folder. Run an `npm install` to make sure you have all the node modules ready. Run an `npm start` to make sure it's connected to localhost:3001. 
   - You're going to keep this terminal window open in order to view the final JSON object output of the data. I also included a `console.table` of the array inside the JSON object in the output so you could get a proper visual to see how the `amountPaid` will change. 

1. Also `cd` into the `frontend` folder on **another** tab on your terminal application and `npm install`, and once that's done grabbing the node modules, then `npm start` that as well and it should take you to a browser window with localhost:3000. (both `backend` and `frontend` should be running now).
    - Once on the localhost:3000, go into your console window on the browser to view the time reports data that you should be uploading. 
    - The database I'm using to store the time reports data is in Firebase and that should already be connected and running. I made sure to already have the file that came with this repo (`time-report-42.csv`) uploaded so you could start with an idea of how the object looks like in the console.
2. Press the `browse` button and select any `csv` file with the `time-report-xx` format mentioned in the rules and you should be able to see it being uploaded to Firebase (seen in console window) and once you select `upload`, the terminal window showing the backend output will display the final data required.
    - Note that you're going to get an alert whenever you upload a new time report, this is due to it firing multiple times, but it is only uploaded once to the database. Best to think of it as a feature rather than a bug (for now) 😅

## Answering your questions
1. I tested the implementation by creating many `csv` files with the format of the file and ran it through the code. Each time, my code was able to parse through the data and upgrade the final JSON object based on employee ID and pay period accurately. It was more of a simple A/B testing of my own work.
1. I would have probably used a more scalable database solution, like MongoDB along with Mongoose. The reason I didn't choose to add those two solutions was because I'm much more front-end focused and I thought it best to stick to my guns in the short amount of time necessary. I tried to connect the code to MySQL but found it to be more tedious and not as user-friendly for you folks to test out the challenge on. Firebase was the best alternative because:
    - It was super easy to set up. I didn't need to download anything and have you download anything either.
    - I found it to be a more intuitive database management system for someone who isn't very well-versed in backend and MERN
1. Biggest compromise is that I really wanted to go into the challenge with a backend approach. However, I realized that in the short amount of time I had, I couldn't produce something that is simple and quality-driven with just using backend. I'm primarily a frontend developer and I was able to tackle the challenge with more confidence in my step by thinking about a file upload from the frontend to a NodeJS server in the backend, that would eventually handle the data I was sending it.
    - I wanted to incorporate more MongoDB and Mongoose (mainly to also learn those tools)
    - I wanted to run the HTTP request straight from Postman and upload the file from there, but it made more sense to me to create a frontend that could handle the first task of the challenge and handle the bugs later.
    - I also wanted to work more on the Firebase bug I had that was firing multiple message of my data being pushed (even though each unique file is only ever uploaded once)

I truly hope you enjoyed my take on this challenge! 

Reem