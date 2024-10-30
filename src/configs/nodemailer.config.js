'use strict';

const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: '',
    port: 465,
    secure: true,
    auth: {
      user: '',
      pass: ''
    }
})

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'florencio37@ethereal.email',
      pass: '2CwDyYTR73417GZF9N'
  }
});
module.exports = transporter
