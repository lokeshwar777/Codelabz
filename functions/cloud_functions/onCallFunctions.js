import { https } from "firebase-functions";
import { db, admin } from "../auth";

export const resendVerificationEmailHandler = async data => {
  try {
    if (!data || !data.email) {
      console.log("Email is not defined");
      throw new https.HttpsError(
        "invalid-argument",
        "Email is required for the operation"
      );
    }
    const email = data.email;
    //get userRecord
    const userRecord = await admin.auth().getUserByEmail(email);

    if (!userRecord) {
      console.log(`The given email: ${email} does not exist.`);
      throw new https.HttpsError(
        "not-found",
        "The user does not exist."
      );
    }

    if (userRecord && userRecord.emailVerified === true) {
      console.log(`The given email: ${email} is already verified.`);
      throw new https.HttpsError(
        "aborted",
        "The given email is already verified."
      );
    }

    //send the verification email
    const link = await admin
      .auth()
      .generateEmailVerificationLink(userRecord.email);

    await db.collection("cl_mail").add({
      to: userRecord.email,
      template: {
        name: "verificationEmailTemplate",
        data: {
          verificationLink: link
        }
      }
    });

    return console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.log(error);
    throw new https.HttpsError(
      "invalid-argument",
      error.message,
      error
    );
  }
};

export const sendPasswordUpdateEmailHandler = async (data, context) => {
  try {
    const { email } = data;

    if (!context.auth) {
      console.log("The request must be authenticated.");
      throw new https.HttpsError(
        "unauthenticated",
        "The request does not have valid authentication credentials for the operation."
      );
    }
    if (!email) {
      console.log("Email is not provided");
      throw new https.HttpsError(
        "invalid-argument",
        "Email is required for this operation"
      );
    }

    const uid = context.auth.uid;
    const userRecord = await admin.auth().getUser(uid);
    const { email: userRecordEmail } = userRecord;

    if (email !== userRecordEmail) {
      console.log(
        `The given email: ${email} does not match with auth records: ${userRecordEmail}`
      );
      throw new https.HttpsError(
        "invalid-argument",
        "The provided email does not match with the authentication records."
      );
    }

    await db.collection("cl_mail").add({
      to: email,
      template: {
        name: "passwordUpdateEmailTemplate",
        data: {}
      }
    });

    return console.log("Password update email sent");
  } catch (error) {
    console.log(error.message);
    throw new https.HttpsError("aborted", error.message, error);
  }
};
