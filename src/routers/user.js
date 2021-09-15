const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = new express.Router();
const multer = require("multer");
const {transporter} = require('../email/email')

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    transporter.sendMail({
      from :"pankajtest@test.com",
      to : user.email,
      subject : "Sending Welcome Message",
      text : `Welcome ${user.name}, You have signed up on our Website`
    }  ,(err,data) => {
      if(err){
        console.log("email not sent");
      }
      else{
        console.log("Welcome message sent",data);
      }
    })
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
          
     const name = req.user.name;
     const email = req.user.email; 
    await req.user.remove()
    res.send(req.user);
  } catch (e) {

    res.status(500).send({status : "user not present", err : e});
  }
});

// creating a multer instance to upload file on given file
const upload = multer({
  // removing this is will not longer store the file in directory instead we can acccess in function
  limits: {
    fileSize: 800000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg)/)) {
      return cb(new Error("Please upload the document file"));
    }
    cb(undefined, true);
  },
});

// api endpoint to set the image user
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {

    console.log("set avatar method is called")
    try {
      req.user.avatar = req.file.buffer;
      await req.user.save();
    } catch (e) {
      res.status(400).send("Unabe to save the file");
    }
    res.send("Avater file saved");
  },
  (err, req, res, next) => {
    res
      .status(400)
      .send({
        status: "you have encountered a error",
        errorMessage: err.message,
      });
  }
);

//api endpoint to show the user avatar
router.get("/users/me/avatar", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      res.send("Not a valid user please enter the correct id ");
    }

    res.set("Content-Type", "image/jpeg");
    res.send(user.avatar);
    console.log("file sent");
  } catch (e) {
    res.status(404).send({ status: "some error occured", err: e });
  }
});

module.exports = router;
