const asyncHandler = require("express-async-handler");
const chalk = require("chalk");
const Sponsor = require("../models/sponsor_profile");
const Organization = require("../models/organization");

const createSponsor = asyncHandler(async (req, res) => {
  try {
    await Sponsor.findOne({ name: req.body.name })
      .then(async (result) => {
        if (result === null) {
          const newSponsor = new Sponsor({
            name: req.body.name,
            business_name: req.body.business_name,
            sponsor_type: req.body.sponsor_type,
            art_works: getArtWork(req.body.art_works),
            ts_rate: req.body.ts_rate,
            ps_rate: req.body.ps_rate,
            status: req.body.status,
          });

          await newSponsor.save().then(async () => {
            await getSponsors(req, res);
          });
        } else {
          // console.info(result);
          res.status(409).json({ warning: "Duplicate entry found !" });
        }
      })
      .catch((error) => {
        // console.error(error);
        res.status(500).json({ error: error });
      });
  } catch (e) {
    // console.error(e);
    res.status(e.status).json({ error: e.toString() });
  }
});

function getArtWork(value) {
  const ob = [];
  try {
    value.forEach((value) => {
      ob.push({
        cloud_id: value.cloud_id,
        name: value.name,
        url: value.url,
      });
    });
  } catch (e) {
    console.error(e);
  }
  return ob;
}

async function getSponsors(req, res) {
  await Sponsor.find({ status: req.body.status })
    .then((result) => {
      if (result.length > 0) {
        res.status(200).json({ sponsors: result });
      } else {
        res.status(404).json({ sponsors: [] });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: error });
    });
}

const updateSponsor = asyncHandler(async (req, res) => {
  try {
    const updatedSponsor = {
      name: req.body.name,
      business_name: req.body.business_name,
      sponsor_type: req.body.sponsor_type,
      art_works: getArtWork(req.body.art_works),
      ts_rate: req.body.ts_rate,
      ps_rate: req.body.ps_rate,
      status: req.body.status,
    };

    await Sponsor.findByIdAndUpdate(req.body._id, updatedSponsor, {
      new: true,
      returnDocument: "after",
    })
      .then(async (result) => {
        if (result !== null) {
          /*await Sponsor.find({status: req.body.status}).exec((error1, result1) => {                                                                                                                                                                                                                      });*/
          await getSponsors(req, res);
        } else {
          res.status(404).json({ warning: "Entry not found !" });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: error });
      });
  } catch (e) {
    console.error(e);
    res.status(e.status).json({ error: e.toString() });
  }
});

const getSponsorByName = asyncHandler(async (req, res) => {
  try {
    await Sponsor.findOne({ name: req.query.name })
      .then((result) => {
        if (result !== null) {
          res.status(200).json(result);
        } else {
          res.status(404).json({});
          console.warn(chalk.yellow("Sponsor not found"));
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: error });
      });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: e.toString() });
  }
});

const getSponsorsByStatus = asyncHandler(async (req, res) => {
  try {
    await Sponsor.find({ status: req.query.status })
      .then((result) => {
        if (result !== null) {
          res.status(200).json({ sponsors: result });
        } else {
          res.status(404).json({ sponsors: [] });
          console.warn(chalk.yellow("Sponsor not found"));
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: error });
      });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: e.toString() });
  }
});

const getSponsorsByIdList = asyncHandler(async (req, res) => {
  try {
    await Sponsor.find({ _id: { $in: req.body.ids } })
      .then((result) => {
        if (result.length > 0) {
          res.status(200).json({ sponsors: result });
        } else {
          res.status(404).json({ sponsors: [] });
        }
      })
      .catch((reason) => {
        throw reason;
      });
  } catch (e) {
    console.error(chalk.red(e));
    res.status(500).json({ error: e.toString() });
  }
});

module.exports = {
  createSponsor,
  getSponsorByName,
  getSponsorsByStatus,
  updateSponsor,
  getSponsorsByIdList,
};
