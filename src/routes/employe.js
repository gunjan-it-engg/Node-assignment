const express = require("express")
const employe = new express.Router();
const Employee = require("../model/employe");
const auth = require("../middleware/auth");

employe.post("/employee",  async (req, res) => {
    try {
      const employee = new Employee(req.body);
      await employee.save();
      res.status(201).send({ employee });
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  });

employe.get("/employee/list" , async(req,res)=>{
    try{
        await Employee.find({})
      .then((data) => {
        res.status(201).send(data);
      })
      .catch((e) => {
        res.status(401).send(e);
      });
    
    } catch (e){
        res.status(500).send({error:e.message})
    }
})

employe.delete("/employee/delete/:id", async(req,res)=>{
  let _id = req.params.id
  console.log(_id)
  try{
    Employee.findByIdAndDelete(_id).then((data)=>{
      res.status(201).send(data)
    })
  } catch(e){
    res.status(400).send({error:e.message})
  }
})

employe.patch("/employee/edit/:id",  async (req, res) => {
  try {
    console.log(req.body)
    const { name , lastName , gender , email , dob , country , state , city , phone , salary , address  } = req.body;
    const employeeid = req.params.id;
    const employeinfo = await Employee.findByIdAndUpdate(
      employeeid,
      {
        name,
        lastName,
        gender,
        dob,
        country,
        state,
        city,
        salary,
        address,
        email,
        phone,
      },
      { new: true }
    );

    res.status(201).send(employeinfo);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = employe
