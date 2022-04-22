const mongoose = require("mongoose");
const validator = require("validator");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastName: {
        type: String,
        required:true,
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

    gender:{
        type: String
    },

    phone: {
      type: Number,
      unique: true,
      required: true,
      minlength: 10,
      maxlength: 10,
    },

    salary:{
        type:Number,
    },

    dob:{
        type: Date,
    },

    address:{
        type: String,
    },

    country:{
        type: String
    },
    state:{
        type:String
    },
    city:{
        type:String
    },


    

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


const Employee = mongoose.model("employee", employeeSchema);
module.exports = Employee;
