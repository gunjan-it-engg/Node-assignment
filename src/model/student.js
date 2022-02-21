const mongoose = require("mongoose");
const validator = require("validator");

const studentSchema = new mongoose.Schema(
  {
    student_name: {
      type: String,

      required: true,
      trim: true,
      minlength: 4,
      maxlength: 25,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    phone: {
      type: Number,
      unique: true,
      required: true,
      minlength: 10,
      maxlength: 10,
    },

    pictures: [
      {
        avatar: {
          type: Buffer,
        },
      },
    ],

    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// method for get profile and mainupulate some important information
studentSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
};

studentSchema.methods.isPhone = async function (phoneNumber) {
  var regExp = "(0/91)?[7-9][0-9]{9}";
  var phone = await String(phoneNumber).match(regExp);
  if (phone) {
    return true;
  }
  return false;
};

studentSchema.methods.isName = function (studentName) {
  const specialChars = `/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;`;

  const isSpecialCharsPresent = specialChars
    .split("")
    .some((char) => studentName.includes(char)); // true if present and false if not
  return isSpecialCharsPresent;
};

studentSchema.pre("save", async function (next) {
  const user = this;
  next();
});

const Student = mongoose.model("student", studentSchema);
module.exports = Student;
