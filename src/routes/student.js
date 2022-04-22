const express = require("express");
const student = new express.Router();
const Student = require("../model/student");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const res = require("express/lib/response");

// admin login

student.post("/student", auth, async (req, res) => {
  try {
    const student = new Student(req.body);
    const number = await student.isPhone(req.body.phone);
    if (number == false) {
      res.status(404).send("Phone number is invalid");
    }
    const name = await student.isName(req.body.student_name);
    if (name) {
      res.status(404).send("invalid name");
    }
    await student.save();
    res.status(201).send({ student });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

student.get("/students", auth, (req, res) => {
  Student.find({})
    .then((student) => {
      res.status(200).send(student);
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});

student.delete("/student/:id", auth, async (req, res) => {
  try {
    const studentid = req.params.id;
    const student = await Student.findOneAndDelete({ studentid });
    res.status(200).send(student);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

student.patch("/student/:id", auth, async (req, res) => {
  try {
    const { student_name, email, phone } = req.body;
    const studentid = req.params.id;
    const studentinfo = await Student.findByIdAndUpdate(
      studentid,
      {
        student_name,
        email,
        phone,
      },
      { new: true }
    );

    res.status(200).send(studentinfo);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// image upload

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
});

student.post("/student/img", auth, upload.single("file"), async (req, res) => {
  try {
    const avatar = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    const studentImg = await Student.findById(req.query.stuId);
    studentImg.pictures = studentImg.pictures.concat({ avatar });
    await studentImg.save();
    res.send(studentImg);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// display image
student.get("/student/img", auth, async (req, res) => {
  try {
    const stu = await Student.findById(req.query.stuId);
    if (!stu || !stu.pictures) {
      throw new Error();
    }
    res.set("Content-Type", "image/jpg");
    res.send(stu.pictures);
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

// update display image

student.patch("studentss/image", auth, async (req, res) => {
  const updates = Object.keys(sharp(req.file.buffer));
  const allowedUpdates = ["file"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates!" });
  }
  try {
    const _id = req.query.stuId;
    const student = await Student.findById(req.query.stuId);
    updates.forEach((update) => (student[update] = req.file.buffer[update]));
    await student.save();

    if (!student) {
      return res.status(404).send();
    }
    res.send(student);
  } catch (e) {
    res.status(400).send(e);
  }
});

student.patch("/student/:id", auth, upload.single("file"), async (req, res) => {
  try {
    const pictures = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    const _id = req.params.id;
    const hospitalsinfo = await Student.findByIdAndUpdate(
      req.params.id,

      (pictures.avatar = pictures),

      { new: true }
    );

    res.status(200).send(hospitalsinfo);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = student;
