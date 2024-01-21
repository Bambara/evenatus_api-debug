const asyncHandler = require("express-async-handler");
const OrganizerProfile = require("../models/organizer_profile");
const mongoose = require("mongoose");
const chalk = require("chalk");

const createOrganizerProfile = asyncHandler(async (req, res) => {
  try {
    OrganizerProfile.findOne({ name: req.body.name })
      .then(async (value) => {
        if (value != null) {
          console.warn(chalk.yellow("Name is already exist !"));
          res.status(409).json(value);
        } else {
          const newOrganizerProfile = new OrganizerProfile({
            name: req.body.name,
            type: req.body.type,
            avatar: {
              cloud_id: req.body.avatar.cloud_id,
              name: req.body.avatar.name,
              url: req.body.avatar.url,
            },
            status: req.body.status,
            organization_id: req.body.organization_id,
            user_id: req.body.user_id,
          });

          await newOrganizerProfile
            .save()
            .then(async (value) => {
              await OrganizerProfile.aggregate([
                {
                  $match: { _id: new mongoose.Types.ObjectId(result._id) },
                },
                {
                  $lookup: {
                    from: "organizations",
                    localField: "organization_id",
                    foreignField: "_id",
                    as: "organization",
                  },
                },
                // ,
                // {
                //     $replaceRoot: {newRoot: {$mergeObjects: [{$arrayElemAt: ["$whole_profile", 0]}, "$$ROOT"]}}
                // },
                // {$project: {whole_profile: 0}}
              ])
                .then((result) => {
                  if (result !== null) {
                    console.info(chalk.green("Profile updated"));
                    res.status(201).json(result[0]);
                  } else {
                    console.warn(chalk.yellow("Profile Not Found"));
                    res.status(404).json({});
                  }
                })
                .catch((reason) => {
                  console.error(chalk.red(error));
                  res.status(500).json({});
                });
            })
            .catch((reason) => {
              console.error(chalk.red(reason));
              res.status(500).json({ error: reason });
            });
        }
      })
      .catch((reason) => {
        console.error(chalk.red(e));
        res.status(500).json({ error: reason });
      });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
});

const updateOrganizerProfile = asyncHandler(async (req, res) => {
  try {
    const updatedOrganizer = {
      name: req.body.name,
      type: req.body.type,
      avatar: {
        cloud_id: req.body.avatar.cloud_id,
        name: req.body.avatar.name,
        url: req.body.avatar.url,
      },
      status: req.body.status,
      organization_id: req.body.organization_id,
      user_id: req.body.user_id,
    };

    await OrganizerProfile.findByIdAndUpdate(req.query.id, updatedOrganizer, {
      new: true,
      returnDocument: "after",
    })
      .then(async (result) => {
        if (result !== null) {
          await OrganizerProfile.aggregate([
            {
              $match: { _id: new mongoose.Types.ObjectId(result._id) },
            },
            {
              $lookup: {
                from: "organizations",
                localField: "organization_id",
                foreignField: "_id",
                as: "organization",
              },
            },
            // ,
            // {
            //     $replaceRoot: {newRoot: {$mergeObjects: [{$arrayElemAt: ["$whole_profile", 0]}, "$$ROOT"]}}
            // },
            // {$project: {whole_profile: 0}}
          ])
            .then((result) => {
              if (result !== null) {
                console.info(chalk.green("Profile updated"));
                res.status(200).json(result[0]);
              } else {
                console.warn(chalk.yellow("Profile Not Found"));
                res.status(404).json({});
              }
            })
            .catch((reason) => {
              console.error(chalk.red(error));
              res.status(500).json({});
            });
        } else {
          console.warn(chalk.yellow("Profile Not Found"));
          res.status(404).json({});
        }
      })
      .catch((error) => {
        console.error(chalk.red(error));
        res.status(500).json({});
      });
  } catch (e) {
    console.error(chalk.red(e));
    res.status(500).json({ error: e });
  }
});

const getOrganizerProfile = asyncHandler(async (req, res) => {
  /*        await OrganizerProfile.findOne({user_id: req.query.user_id})
                  .then((result) => {
                      if (result !== null) {
                          res.status(200).json(result);
                      } else {
                          res.status(404).json({});
                      }
                  })
                  .catch((reason) => {
                      res.status(500).json({});
                  });*/

  await OrganizerProfile.aggregate([
    {
      $match: { user_id: new mongoose.Types.ObjectId(req.query.user_id) },
    },
    {
      $lookup: {
        from: "organizations",
        localField: "organization_id",
        foreignField: "_id",
        as: "organization",
      },
    },
    // ,
    // {
    //     $replaceRoot: {newRoot: {$mergeObjects: [{$arrayElemAt: ["$whole_profile", 0]}, "$$ROOT"]}}
    // },
    // {$project: {whole_profile: 0}}
  ])
    .then((result) => {
      if (result !== null) {
        res.status(200).json(result[0]);
      } else {
        res.status(404).json({});
      }
    })
    .catch((reason) => {
      res.status(500).json({});
    });
});

module.exports = {
  createOrganizerProfile,
  getOrganizerProfile,
  updateOrganizerProfile,
};
