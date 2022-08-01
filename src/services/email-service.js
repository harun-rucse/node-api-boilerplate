const nodemailer = require('nodemailer');
const config = require('../config');
const templates = require('../utils/templates');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `${config.APP_NAME} <${config.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: config.SENDGRID_USERNAME,
          pass: config.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: config.EMAIL_HOST,
      port: config.EMAIL_PORT,
      auth: {
        user: config.EMAIL_USERNAME,
        pass: config.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    // Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: template,
    };

    // Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', `Welcome to the ${config.APP_NAME} Family!`);
  }

  async sendVerifyEmail() {
    await this.send(templates.verifyEmailTemplate(this.firstName, this.url), 'Verify Email Address');
  }

  async sendPasswordReset() {
    await this.send(
      templates.forgotEmailTemplate(this.firstName, this.url),
      `Your password reset token (valid for only ${process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN} minutes)`
    );
  }
};
