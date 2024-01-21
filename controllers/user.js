const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const userModel = require("../models/user");

const generateToken = require("../utils/generateToken");
const generateTokenVendor = require("../utils/generateTokenVendor");
const Organization = require("../models/organization");
const chalk = require("chalk");

uploadImage = (req, res) => {
  cloudinary.uploader.upload(
    req.file.path,
    {
      resource_type: "image",
      folder: "image",
    },

    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      var upload = new Upload({
        name: req.file.originalname,
        url: result.url,
        cloudinary_id: result.public_id,
        description: req.body.description,
      });
      upload.save((err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        return res.status(200).send(result);
      });
    },
  );
};

function getReminderType(value) {
  const ob = [];
  value.forEach((value) => {
    ob.push({
      type: value.type,
      status: value.status,
    });
  });
  return ob;
}

function getPlayFrequency(value) {
  const ob = [];
  value.forEach((value) => {
    ob.push({
      type: value.type,
      value: value.value,
    });
  });
  return ob;
}

function getAccountType(value) {
  const ob = [];
  value.forEach((value) => {
    ob.push({
      type: value.type,
      status: value.status,
    });
  });
  return ob;
}

const signing = asyncHandler(async (req, res) => {
  try {
    await userModel
      .findOne({
        $or: [
          { user_name: req.body.user_name },
          { email: req.body.user_name },
          { mobile: req.body.user_name },
        ],
      })
      .then((user) => {
        if (user) {
          if (bcrypt.compareSync(req.body.password, user.password)) {
            if (user.role === "PREMIUM") {
              res.send({
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                user_name: user.user_name,
                role: user.role,
                token: generateTokenVendor(user),
              });
            } else {
              res.send({
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                user_name: user.user_name,
                role: user.role,
                token: generateToken(user),
              });
            }
          } else {
            res.status(401).json({ error: "Invalid User Name or Password" });
          }
        }
      })
      .catch(() => {
        res.status(401).json({ error: "Invalid User Name or Password" });
      });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.toString() });
  }
});

const signup = asyncHandler(async (req, res) => {
  let userProfile;

  await userModel
    .findOne({
      $or: [
        { email: req.body.email },
        { mobile: req.body.mobile },
        { user_name: req.body.user_name },
      ],
    })
    .then((isAlready) => {
      if (!isAlready) {
        userProfile = new userModel({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          user_name: req.body.user_name,
          email: req.body.email,
          mobile: req.body.mobile,
          contact_info: req.body.contact_info,
          address_info: req.body.address_info,
          password: bcrypt.hashSync(req.body.password),
          role: req.body.role,
          tfa_status: req.body.tfa_status,
          status: req.body.status,
          avatar: req.body.avatar,
          account_type: getAccountType(req.body.account_type),
          play_frequency: getPlayFrequency(req.body.play_frequency),
          reminder_type: getReminderType(req.body.reminder_type),
        });

        userProfile
          .save()
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(400).json({ error: error.toString() });
          });
      } else {
        res.status(409).json({ error: "User is already registered" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: error.toString() });
    });
});

const update = asyncHandler(async (req, res) => {
  try {
    await userModel
      .findById(req.query.id)
      .then(async (user) => {
        if (user) {
          user.first_name = req.body.first_name || user.first_name;
          user.last_name = req.body.last_name || user.last_name;
          user.email = req.body.email || user.email;
          user.mobile = req.body.mobile || user.mobile;
          user.contact_info = req.body.contact_info || user.contact_info;
          user.address_info = req.body.address_info || user.address_info;
          // if (req.body.password) {
          //   user.password = bcrypt.hashSync(req.body.password);
          // }
          user.role = req.body.role || user.role;
          user.tfa_status = req.body.tfa_status || user.tfa_status;
          user.avatar = req.body.avatar || user.avatar;
          user.account_type =
            getAccountType(req.body.account_type) || user.account_type;
          user.play_frequency =
            getPlayFrequency(req.body.play_frequency) || user.play_frequency;
          user.reminder_type =
            getReminderType(req.body.reminder_type) || user.reminder_type;

          await user
            .save()
            .then((result) => res.status(200).json(result))
            .catch((error) => res.status(400).json({ error: error }));
        } else {
          res.status(404).json({ message: "User not Found!" });
        }
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.toString() });
  }
});

const deleteFreshUser = asyncHandler(async (req, res) => {
  try {
    await userModel
      .findById(req["query"].id)
      .then(async (user) => {
        if (user) {
          await userModel
            .deleteOne({ _id: req["query"].id })
            .then(async () => {
              res.status(200).json({});
            })
            .catch((error) => {
              res.status(404).json({ error: error.toString() });
            });
        } else {
          res.status(401).json({ message: "User not Found!" });
        }
      })
      .catch((error) => {
        res.status(404).json({ error: error.toString() });
      });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const bar = await userModel.find({ status: req.query.status });
  res.json({ users: bar });
});

const getUserById = asyncHandler(async (req, res) => {
  try {
    await userModel
      .findOne({ _id: req.query.id, status: req.query.status })
      .then((user) => {
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({ message: "User Not Found" });
        }
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.toString() });
  }
});

const getUserByIdList = asyncHandler(async (req, res) => {
  try {
    await userModel
      .find({ _id: { $in: req["body"].ids } })
      .then((result) => {
        if (result.length > 0) {
          res.status(200).json(result);
        } else {
          res.status(404).json({});
        }
      })
      .catch((reason) => {
        throw reason;
      });

    /*await Organization.aggregate([{$match: {_id: {$in: ["647067a1a24a1d0fdcc1349d"]}}}]).then(result => {
                    if (result.length > 0) {
                        res.status(200).json({organizations: result});
                    } else {
                        res.status(404).json({organizations: []});
                    }
                }).catch(reason => {
                    throw reason;
                });*/
  } catch (e) {
    console.error(chalk.red(e));
    res.status(500).json({ error: e.toString() });
  }
});

module.exports = {
  getAllUsers,
  signing,
  signup,
  update,
  getUserById,
  deleteFreshUser,
};
