const asyncHandler = require("express-async-handler");

const chalk = require("chalk");

const Organization = require("../models/organization");
const mongoose = require("mongoose");

async function getOrganizations(req, res) {
  let value;
  await Organization.find({
    status: "ACTIVE",
  })
    .then((result) => {
      value = result;
    })
    .catch((reason) => {
      value = reason;
    });
  return value;
}

function extractMember(memberList) {
  const members = [];
  try {
    memberList.forEach((member) => {
      members.push({
        level: member.level,
        member_id: member.member_id,
        status: member.status,
      });
    });
  } catch (e) {
    console.error(e);
  }
  return members;
}

const createOrganization = asyncHandler(async (req, res) => {
  try {
    await Organization.findOne({ name: req.body.name })
      .then(async () => {
        const newOrganization = new Organization({
          name: req.body.name,
          logo: {
            cloud_id: req.body.logo.cloud_id,
            name: req.body.logo.name,
            url: req.body.logo.url,
          },
          type: req.body.type,
          status: req.body.status,
          members: extractMember(req.body.members),
        });

        await newOrganization.save().then(async () => {
          await getOrganizations(req, res)
            .then((value) => {
              if (value.length > 0) {
                res.status(200).json({ organizations: value });
              } else {
                res.status(404).json({ organizations: [] });
              }
            })
            .catch((reason) => {
              console.error(reason);
              res.status(500).json({ error: reason });
            });
        });
      })
      .catch((error) => {
        res.status(409).json({ warning: "Duplicate entry found !" });
      });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.toString() });
  }
});

const updateOrganization = asyncHandler(async (req, res) => {
  try {
    const updatedOrganization = {
      name: req.body.name,
      logo: {
        cloud_id: req.body.logo.cloud_id,
        name: req.body.logo.name,
        url: req.body.logo.url,
      },
      type: req.body.type,
      status: req.body.status,
    };

    await Organization.findByIdAndUpdate(req.query.id, updatedOrganization, {
      new: true,
      returnDocument: "after",
    })
      .then(async (result) => {
        if (result !== null) {
          await getOrganizations(req, res);
        } else {
          res.status(404).json({ organizations: [] });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: error });
      });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.toString() });
  }
});

const getOrganizationByName = asyncHandler(async (req, res) => {
  try {
    await Organization.findOne({ name: req.query.name })
      .then((result) => {
        if (result !== null) {
          res.status(200).json(result);
        } else {
          res.status(404).json(result);
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: error });
      });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
});

const getOrganizationById = asyncHandler(async (req, res) => {
  try {
    await Organization.findOne({ _id: req.query.id })
      .then((result) => {
        if (result !== null) {
          res.status(200).json(result);
        } else {
          res.status(404).json(result);
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: error });
      });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
});

const getAllOrganizations = asyncHandler(async (req, res) => {
  try {
    await Organization.find({ status: req.query.status })
      .then((result) => {
        if (result.length > 0) {
          res.status(200).json({ organizations: result });
        } else {
          res.status(404).json({ organizations: [] });
        }
      })
      .catch((reason) => {
        throw reason;
      });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.toString() });
  }
});

const getAllOrganizationsByType = asyncHandler(async (req, res) => {
  try {
    await Organization.find({ status: req.query.status, type: req.query.type })
      .then((result) => {
        if (result.length > 0) {
          res.status(200).json({ organizations: result });
        } else {
          res.status(404).json({ organizations: [] });
        }
      })
      .catch((reason) => {
        throw reason;
      });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.toString() });
  }
});

const getOrganizationsByIdList = asyncHandler(async (req, res) => {
  try {
    await Organization.find({ _id: { $in: req.body.ids } })
      .then((result) => {
        if (result.length > 0) {
          res.status(200).json({ organizations: result });
        } else {
          res.status(404).json({ organizations: [] });
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
  createOrganization,
  getOrganizationByName,
  getOrganizationById,
  getAllOrganizations,
  updateOrganization,
  getOrganizationsByIdList,
  getAllOrganizationsByType,
};
