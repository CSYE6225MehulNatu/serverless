const functions = require("@google-cloud/functions-framework");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailGun = new Mailgun(formData);
const mg = mailGun.client({username: "api", key: process.env.MAILGUN_API_KEY || "key-yourkeyhere"});
const domain = process.env.DOMAIN_NAME;
const port = process.env.DOMAIN_PORT;

const { saveEmailVerificationStatus } = require("./EmailService");
const Constants = require("./Constants");

// Register a CloudEvent function with the Functions Framework
functions.cloudEvent("myCloudEventFunction", cloudEvent => {
  // Your code here
  // Access the CloudEvent data payload via cloudEvent.data
  try {
    const base64 = cloudEvent.data.message.data;
    const emailNodeString = Buffer.from(base64, 'base64').toString();
    const jsonObject = JSON.parse(emailNodeString);
    const email = jsonObject.email;
    
    //const expirationTime = new Date(Date.now() + 2 * 60000);
    const uniqueCode = generateRandomValue(email);

    const verificationLink = `http://${domain}:${port}/v1/user/verify?code=${uniqueCode}`; 

    const form = new FormData();

    form.append("from", "Your App <mailgun@spoderman.me>");
    form.append("to", email);
    form.append("subject", "Verify Your Email for Spoderman!!!!");
    form.append("html", `
      <p>Hey yo Male/Female Bro please verify your email by copying and pasting the following URL into your browser:</p>
      <p>${verificationLink}</p>
    `);

    mg.messages.create("spoderman.me", {
      from: "Your App <mailgun@spoderman.me>",
      to: email,
      subject: "Verify Your Email for Spoderman!!!!",
      html: `
          <p>Hey yo Male/Female Bro please verify your email by copying and pasting the following URL into your browser:</p>
          <p>${verificationLink}</p>
      `
    })
    .then(async (body) => {
        console.log("Verification Email Successfully Sent: " + JSON.stringify(body));
        try {
            await saveEmailVerificationStatus(email, Constants.emailVerificationPending, uniqueCode);
            console.log('Email verification record created successfully');
        } catch(dbError) {
            console.error('Failed to create email verification record:', dbError);
        }
    })
    .catch(error => {
        console.error("Error while sending email verification to - " + email, error);
    });
  } catch (err) {
    console.log("Error while sending email: " + err);
  }
});


const generateRandomValue = (email) => {
  const currentTimeMillis = Date.now();

// Convert the milliseconds to a base64 string
  const base64String = Buffer.from(email[email.length - 1] + currentTimeMillis.toString() + email[0]).toString('base64');
  console.log("Generated uniqueKey");
  return base64String;
}

const createVerficationlink = (uniqueCode) => {
  const currentTimeMillis = Date.now();

// Convert the milliseconds to a base64 string
  const base64String = Buffer.from(email[email.length - 1] + currentTimeMillis.toString() + email[0]).toString('base64');
  console.log("Generated uniqueKey");
  return base64String;
}