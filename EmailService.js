const { EmailVModel } = require("./DbConfig");


const saveEmailVerificationStatus = async (email, verficationStatus, verificationCodeValue) => {
    try {
        const jane = await EmailVModel.create({email: email, status: verficationStatus, 
            verificationCode: verificationCodeValue});
        console.info("Saved jane object : " + jane.toString());
    } catch (err) {
        console.error("Error while saving : " + email + " : " + verficationStatus);
        throw err;
    }
}

module.exports = {
    saveEmailVerificationStatus
}