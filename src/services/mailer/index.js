var nodemailer = require('nodemailer');
var config = require('../../config');
var path = require('path');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.mailerAddress,
        pass: config.mailerPassword
    }
});

module.exports = {
    requestOptions: function (user) {
        var link = config.resetPassword + user.token;
        // var link = path.join(config.resetPassword,user.token);
        return {
            from: 'Witty Wallet<no-reply@config.mailerAddress>',
            to: user.email,
            subject: 'Witty Wallet reset password request',
            html: `<p>You or (someone else) has requested to change your password, please click <a href="${link}">this link</a> to complete the process.</p> <p>If you do not remember making this request, please ignore this message and your password will remain unchanged.</p><p>Regards,</p><p>Anthony from the Witty Team</p>`
        }
    },
    resetOptions: function (user, temp) {
        return {
            from: 'Witty Wallet<no-reply@config.mailerAddress>',
            to: user.email,
            subject: 'Witty Wallet reset password request',
            html: `<p>Your new password is ${temp}</p><p>Use this password to login and change it to something more rememberable</p>`
        }
    },
    activateOptions: function (user) {
        var link = config.activate + user.token;
        return {
            from: 'Witty Wallet<no-reply@config.mailerAddress>',
            to: user.email,
            subject: 'Witty Wallet Account Activation',
            html: `<p>Thank you for registering, please click <a href="${link}">this link</a> to complete the registration process.</p><p>Regards,</p><p>Anthony from the Witty Team</p>`
        }
    },
    sendMail: function (options) {
        transporter.sendMail(options, function (err, info) {
            if (err) return err;
            return info;
        });
    }

}

