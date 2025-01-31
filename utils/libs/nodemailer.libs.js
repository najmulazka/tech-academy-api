const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const ejs = require('ejs');
const { GOOGLE_REFRESH_TOKEN, GOOGLE_SENDER_EMAIL, GOOGLE_PASS_EMAIL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

module.exports = {
  sendEmail: async (to, subject, html) => {
    // const accesToken = await oauth2Client.getAccessToken();

    // const transport = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     type: 'OAuth2',
    //     user: GOOGLE_SENDER_EMAIL,
    //     clientId: GOOGLE_CLIENT_ID,
    //     clientSecret: GOOGLE_CLIENT_SECRET,
    //     refreshToken: GOOGLE_REFRESH_TOKEN,
    //     accessToken: accesToken,
    //   },
    // });

    // await transport.sendMail({ to, subject, html });
    // console.log('send mail success');

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: GOOGLE_SENDER_EMAIL,
        pass: GOOGLE_PASS_EMAIL,
      },
    });

    const info = await transporter.sendMail({
      from: GOOGLE_SENDER_EMAIL,
      to,
      subject,
      // text: "Hello world?dfgd", // plain text body
      html,
    });

    // console.log('Message sent: %s', info.messageId);
    // console.log('send mail success');
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  },

  getHtml: (fileName, data) => {
    return new Promise((resolve, reject) => {
      const path = `${__dirname}/../../views/templates/${fileName}`;

      ejs.renderFile(path, data, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  },
};
