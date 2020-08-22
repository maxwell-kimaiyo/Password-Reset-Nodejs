import User from "../models/user.model";
import crypto from "crypto";
const nodemailer = require("nodemailer");

function showRecoverPass(req, res) {
  res.locals = {
    title: "Password Recovery",
  };
  res.render("Auth/reset", {
    success: req.flash("success"),
    error: req.flash("error"),
  });
}

async function showConfirm(req, res) {
  await User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    },
    function (err, user) {
      if (!user) {
        req.flash("error", "Password reset token is invalid or has expired.");
        return res.redirect("/reset");
      }
      res.locals = {
        title: "Password confirm",
      };
      res.render("Auth/confirm", {
        success: req.flash("success"),
        error: req.flash("error"),
      });
    }
  );
}

async function recoverPass(req, res, next) {
  let token = crypto.randomBytes(20).toString("hex");
  await User.findOne({ email: req.body.email }, function (err, user) {
    if (!user) {
      req.flash("error", "No account with that email address exists");
      return res.redirect("/reset");
    } else {
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      user.save();
      let smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "example@gmail.com",
          pass: "12345",
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      let mailOptions = {
        to: user.email,
        from: "example@gmail.com",
        subject: "Password Reset",
        text:
          "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
          "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
          "http://" +
          req.headers.host +
          "/reset/" +
          token +
          "\n\n" +
          "If you did not request this, please ignore this email and your password will remain unchanged.\n",
      };
      smtpTransport.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log("Success");
          req.flash(
            "success",
            "An e-mail has been sent to " +
              user.email +
              " with further instructions."
          );
        }
      });
      return res.redirect("/reset");
    }
  });
}

async function confirm(req, res) {
  await User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    },
    function (err, user, next) {
      if (!user) {
        req.flash("error", "Password reset token is invalid or has expired.");
        return res.redirect("/reset");
      } else {
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        console.log("password" + user.password + "and the user is" + user);

        user.save(function (err) {
          if (err) {
            console.log("here");
            return res.redirect("/reset'");
          } else {
            console.log("here2");
            req.logIn(user, function (err) {
              done(err, user);
              var smtpTrans = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                  user: "example@gmail.com",
                  pass: "12345",
                },
              });
              var mailOptions = {
                to: user.email,
                from: "myemail",
                subject: "Your password has been changed",
                text:
                  "Hello,\n\n" +
                  " - This is a confirmation that the password for your account " +
                  user.email +
                  " has just been changed.\n",
              };
              smtpTrans.sendMail(mailOptions, function (err) {
                req.flash(
                  "success",
                  "Success! Your password has been changed."
                );
                done(err);
              });
              res.redirect("/");
            });
          }
        });
      }
    }
  );
}

module.exports = {
  showRecoverPass: showRecoverPass,
  recoverPass: recoverPass,
  confirm: confirm,
  showConfirm:showConfirm
};
