const nodemailer = require('nodemailer');
const config = require('../config');
const emailTemplate = require('../utils/email-template');

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

  async sendVerifyEmail() {
    const title = 'Confirm Your Email Address';
    const description = `Tap the button below to confirm your email address. If you didn't create an account, you can safely delete this email.`;
    const buttonText = 'Verify Email Address';

    const template = emailTemplate({ title, description, buttonText, name: this.firstName, url: this.url });

    await this.send(template, 'Verify Email Address');
  }

  async sendPasswordReset() {
    const title = 'Reset Your Password';
    const description = `Tap the button below to reset your customer account password. If you didn't request a new password, you can safely delete this email.`;
    const buttonText = 'Reset Password';

    const template = emailTemplate({ title, description, buttonText, name: this.firstName, url: this.url });

    await this.send(
      template,
      `Your password reset token (valid for only ${process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN} minutes)`
    );
  }
};
