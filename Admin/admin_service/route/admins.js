const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const Admin = require("../model/Admin");
const verifyRequiredAttributes = require("../middleware/verifyRequiredAttributes");

// Define the API routes
// get one admin by query
router.get("/query?", (req, res) => {
  const email = req.query.email;
  const refreshToken = req.query.refreshToken;

  if (!email && !refreshToken) {
    return res.status(400).json({
      message: "Please provide either an email or a refresh token",
    });
  }

  let query;
  if (email) {
    query = { email_address: email };
  } else {
    query = { refreshToken: { $elemMatch: { $eq: refreshToken } } };
  }

  Admin.findOne(query)
    .then((admin) => {
      if (!admin) {
        return res.status(404).json({
          message: "Admin not found",
        });
      }
      res.status(200).json(admin);
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
});

//get all admins
router
  .route("/")
  .get((req, res) => {
    Admin.find()
      .then((admins) => res.json(admins))
      .catch((err) => res.status(500).json({ message: err.message }));
  })
  // create one admin
  .post(verifyRequiredAttributes(Admin), async (req, res) => {
    try {
      // Check if email address is already taken
      const emailExists = await Admin.exists({
        email_address: req.body.email_address,
      });
      if (emailExists) {
        return res
          .status(400)
          .json({ message: "Email address is already taken" });
      }

      // Check if phone number is already taken
      const phoneExists = await Admin.exists({
        phone_number: req.body.phone_number,
      });
      if (phoneExists) {
        return res
          .status(400)
          .json({ message: "Phone number is already taken" });
      }

      // Hash the password
      req.body.password = await bcrypt.hash(req.body.password, 10);

      // Create a new admin instance
      const newAdmin = new Admin(req.body);

      // Save the new admin
      const admin = await newAdmin.save();

      res.status(201).json(admin);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// update one admin by id
router
  .route("/:id")
  .get((req, res) => {
    Admin.findById(req.params.id)
      .then((admin) => {
        if (!admin) return res.status(404).json({ message: "admin not found" });
        res.json({ _id: admin._id });
      })
      .catch((err) => res.status(500).json({ message: err.message }));
  })
  .put(async (req, res) => {
    try {
      const { email_address, phone_number, role_admin, password } = req.body;

      // check if he will modifier the role of admin
      if (role_admin) {
        return res
          .status(400)
          .json({ message: "you can't change the role of the admin!" });
      }

      // hash the pwd if exist in the req.body
      if (password) {
        req.body.password = await bcrypt.hash(password, 10);
      }

      // Check if email address is already taken by another admin
      if (email_address) {
        const emailExists = await Admin.exists({
          email_address,
          _id: { $ne: req.params.id },
        });
        if (emailExists) {
          return res
            .status(400)
            .json({ message: "Email address is already taken" });
        }
      }

      // Check if phone number is already taken by another admin
      if (phone_number) {
        const phoneExists = await Admin.exists({
          phone_number,
          _id: { $ne: req.params.id },
        });
        if (phoneExists) {
          return res
            .status(400)
            .json({ message: "Phone number is already taken" });
        }
      }

      const updatedAdmin = await Admin.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!updatedAdmin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      res.json(updatedAdmin);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  // delete one admin by id
  .delete((req, res) => {
    Admin.findByIdAndRemove(req.params.id)
      .then((admin) => {
        if (!admin) {
          return res.status(404).json({ message: "Admin not found" });
        }
        res.json({ message: "Admin deleted successfully" });
      })
      .catch((err) => res.status(500).json({ message: err.message }));
  });

module.exports = router;
