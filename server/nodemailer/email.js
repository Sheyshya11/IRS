const nodemailer = require("nodemailer");
const fs= require('fs')
var pdf = require("html-pdf");
const options = require("../helper/options");
const pdfTemplate = require("../helper/index");
require("dotenv").config();

module.exports.sendMail = async (req, res) => {
  pdf
    .create(pdfTemplate(req.body), {
        childProcessOptions: {
          env: {
            OPENSSL_CONF: "/dev/null",
          },
        }})
    .toFile("result.pdf", function (err, res) {
      if (err) return console.log(err);
      console.log(res);
    });

 

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: "hello@example.com",
    to: "kawede1245@kameili.com",
    subject: "Regarding Item Aquition Process",
    html: fs.readFileSync("/home/subham/Desktop/IRS main folder/server/view/template.html", "utf8"),
    attachments: [
      {
        filename: "result.pdf",
        path: "/home/subham/Desktop/IRS main folder/server/result.pdf",
        contentType: "application/pdf",
      },
    ],
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      // do something useful
    }
  });
  return res.status(201).send("Email sent successully");
};
