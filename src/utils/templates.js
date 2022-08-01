const config = require('../config');

const forgotEmailTemplate = (name, url) => {
  return `
  <html>

  <head>
      <meta charset="UTF-8">
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
  
      <style>
          * {
              margin: 0;
              padding: 0;
          }
  
          html {
              box-sizing: border-box;
          }
  
          body {
              background: #edf2f7;
              font-family: sans-serif;
          }
  
          .email_container {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 50px;
              gap: 30px;
          }
  
          .title {
              color: #3d4852;
              font-size: 22px;
              font-weight: bold;
          }
  
          .email_card {
              background: #fff;
              padding: 32px;
              width: 650px;
              max-width: 100vw;
              border-radius: 5px;
              display: flex;
              flex-direction: column;
              gap: 20px;
          }
  
          .card_heading {
              color: #3d4852;
              font-size: 18px;
              font-weight: bold;
          }
  
          .card_body {
              display: flex;
              flex-direction: column;
              gap: 25px;
          }
  
          .card_body .text {
              color: #718096;
              font-size: 16px;
              line-height: 1.5em;
          }
  
          .button {
              align-self: center;
              border: none;
              outline: none;
              background: #2d3748;
              padding: 10px 18px;
              border-radius: 4px;
              margin: 10px 0;
          }
  
          .button a {
              color: #fff;
              font-size: 16px;
              text-decoration: none;
          }
  
          .card_footer {
              border-top: 1px solid #e8e5ef;
              margin-top: 25px;
              padding-top: 25px;
          }
  
          .card_footer .text {
              color: #718096;
              font-size: 14px;
              line-height: 25px;
          }
  
          .card_footer .link {
              color: #3869d4;
              font-size: 14px;
              line-height: 25px;
          }
  
          .card_footer span {
              word-break: break-all;
          }
  
          .footer_text {
              color: #b0adc5;
              font-size: 12px;
              line-height: 25px;
          }
  
          @media only screen and (max-width: 870px) {
              .email_card {
                  width: 100%;
                  padding: 20px;
              }
          }
      </style>
  </head>
  
  <body>
      <div class="wrapper">
          <div class="email_container">
              <h3 class="title">${config.APP_NAME}</h3>
              <div class="email_card">
                  <h4 class="card_heading">Hello, ${name}!</h4>
                  <div class="card_body">
                      <p class="text">You are receiving this email because we received a password reset request for your
                          account.</p>
                      <button class="button"><a target="_blank"
                              href="${url}">Reset
                              Password</a></button>
                      <p class="text">This password reset link will expire in ${
                        config.PASSWORD_RESET_TOKEN_EXPIRES_IN
                      } minutes.</p>
                      <p class="text">If you did not request a password reset, no further action is required.</p>
  
                      <div>
                          <p class="text">Regards,</p>
                          <p class="text">${config.APP_NAME}</p>
                      </div>
                  </div>
                  <div class="card_footer">
                      <p class="text">
                          If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into
                          your web browser: <span><a class="link" target="_blank"
                                  href="${url}">${url}</a></span>
                      </p>
                  </div>
              </div>
              <p class="footer_text">© ${new Date().getFullYear()} ${config.APP_NAME}. All rights reserved.</p>
          </div>
      </div>
  </body>
  
  </html>
    `;
};

const verifyEmailTemplate = (name, url) => {
  return `
  <html>

  <head>
      <meta charset="UTF-8">
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
  
      <style>
          * {
              margin: 0;
              padding: 0;
          }
  
          html {
              box-sizing: border-box;
          }
  
          body {
              background: #edf2f7;
              font-family: sans-serif;
          }
  
          .email_container {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 50px;
              gap: 30px;
          }
  
          .title {
              color: #3d4852;
              font-size: 22px;
              font-weight: bold;
          }
  
          .email_card {
              background: #fff;
              padding: 32px;
              width: 650px;
              max-width: 100vw;
              border-radius: 5px;
              display: flex;
              flex-direction: column;
              gap: 20px;
          }
  
          .card_heading {
              color: #3d4852;
              font-size: 18px;
              font-weight: bold;
          }
  
          .card_body {
              display: flex;
              flex-direction: column;
              gap: 25px;
          }
  
          .card_body .text {
              color: #718096;
              font-size: 16px;
              line-height: 1.5em;
          }
  
          .button {
              align-self: center;
              border: none;
              outline: none;
              background: #2d3748;
              padding: 10px 18px;
              border-radius: 4px;
              margin: 10px 0;
          }
  
          .button a {
              color: #fff;
              font-size: 16px;
              text-decoration: none;
          }
  
          .card_footer {
              border-top: 1px solid #e8e5ef;
              margin-top: 25px;
              padding-top: 25px;
          }
  
          .card_footer .text {
              color: #718096;
              font-size: 14px;
              line-height: 25px;
          }
  
          .card_footer .link {
              color: #3869d4;
              font-size: 14px;
              line-height: 25px;
          }
  
          .card_footer span {
              word-break: break-all;
          }
  
          .footer_text {
              color: #b0adc5;
              font-size: 12px;
              line-height: 25px;
          }
  
          @media only screen and (max-width: 870px) {
              .email_card {
                  width: 100%;
                  padding: 20px;
              }
          }
      </style>
  </head>
  
  <body>
      <div class="wrapper">
          <div class="email_container">
              <h3 class="title">${config.APP_NAME}</h3>
              <div class="email_card">
                  <h4 class="card_heading">Hello, ${name}!</h4>
                  <div class="card_body">
                      <p class="text">Please click the button below to verify your email address.</p>
                      <button class="button"><a target="_blank"
                              href="${url}">
                              Verify Email Address
                          </a></button>
                      <p class="text">If you did not create an account, no further action is required.</p>
  
                      <div>
                          <p class="text">Regards,</p>
                          <p class="text">${config.APP_NAME}</p>
                      </div>
                  </div>
                  <div class="card_footer">
                      <p class="text">
  
                          If you're having trouble clicking the "Verify Email Address" button, copy and paste the URL
                          below into your web browser: <span><a class="link" target="_blank"
                                  href="${url}">${url}</a></span>
                      </p>
                  </div>
              </div>
              <p class="footer_text">© ${new Date().getFullYear()} ${config.APP_NAME}. All rights reserved.</p>
          </div>
      </div>
  </body>
  
  </html>
  `;
};

module.exports = { forgotEmailTemplate, verifyEmailTemplate };
