const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const PlayerProfile = require("../models/player_profile");
const playerTeams = require("../models/player_teams");
const chalk = require("chalk");
const OrganizerProfile = require("../models/organizer_profile");
const mongoose = require("mongoose");

function getGameList(value) {
  const ob = [];
  try {
    value.forEach((value) => {
      ob.push({
        ign: value.ign,
        play_frq_type: value.play_frq_type,
        play_frq_time: value.play_frq_time,
        game_id: value.game_id,
        performance_result: {
          match_count: value.performance_result.match_count,
          win_count: value.performance_result.win_count,
          toxic_level: value.performance_result.toxic_level,
          average_damage: value.performance_result.average_damage,
          average_skill: value.performance_result.average_skill,
          mvp_count: value.performance_result.mvp_count,
          remark: value.performance_result.remark,
        },
      });
    });
  } catch (e) {
    console.error(e);
    // res.status(500).json({error: e.toString()});
  }
  return ob;
}

function getSponsorList(value) {
  const ob = [];
  try {
    value.forEach((value) => {
      ob.push({
        type: value.type,
        agreement_start_date: value.agreement_start_date,
        agreement_end_date: value.agreement_end_date,
        remark: value.remark,
        status: value.status,
        sponsor_id: value.sponsor_id,
      });
    });
  } catch (e) {
    console.error(e);
    // res.status(500).json({error: e.toString()});
  }
  return ob;
}

//Player Profile Create (Player) API
const createPlayerProfile = asyncHandler(async (req, res) => {
  try {
    const newPlayerProfile = new PlayerProfile({
      default_ign: req["body"].default_ign,
      avatar: {
        cloud_id: req["body"].avatar.cloud_id,
        name: req["body"].avatar.name,
        url: req["body"].avatar.url,
      },
      club_id: req["body"].club_id,
      clan_id: req["body"].clan_id,
      local_rank: req["body"].local_rank,
      globle_rank: req["body"].globle_rank,
      win_rate: req["body"].win_rate,
      toxic_level: req["body"].toxic_level,
      discipline_level: req["body"].discipline_level,
      skill_level: req["body"].skill_level,
      report_count: req["body"].report_count,
      game_list: getGameList(req["body"].game_list),
      sponsor_list: getSponsorList(req["body"].sponsor_list),
      status: req["body"].status,
      user_id: req["body"].user_id,
    });

    await newPlayerProfile.save().then((savedDoc) => {
      if (savedDoc !== null) {
        res.status(200).json(savedDoc);
      } else {
        res.status(500).json({ error: "Save Fail..!" });
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.toString() });
  }
});

/*const getTNotRegPlayers = async (req, res, next) => {
  try {
    const { keyword, status } = req["query"];

    const userLookup = {
      $lookup: {
        from: "user_profiles",
        localField: "user_id",
        foreignField: "_id",
        as: "user",
      },
    };

    const unwindUser = {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    };

    const matchStatus = {
      $match: {
        "user.status": status,
        $or: [
          { "user.user_name": keyword },
          { "user.email": keyword },
          { "user.mobile": keyword },
          { default_ign: keyword },
        ],
      },
    };

    const projectFields = {
      $project: {
        _id: 0,
        user_id: "$user._id",
        first_name: "$user.first_name",
        last_name: "$user.last_name",
        user_name: "$user.user_name",
        email: "$user.email",
        mobile: "$user.mobile",
        tfa_status: "$user.tfa_status",
        account_type: "$user.account_type",
        play_frequency: "$user.play_frequency",
        reminder_type: "$user.reminder_type",
        player_profile_id: "$_id",
        default_ign: 1,
        avatar: 1,
      },
    };

    const unregisteredPlayers = await Player.aggregate([
      userLookup,
      unwindUser,
      matchStatus,
      projectFields,
    ]);

    res.json({ unregistered_players: unregisteredPlayers });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  getTNotRegPlayers,
  createPlayerProfile,
};*/

//Get player profile using user id
const getPlayerProfileByUserId = asyncHandler(async (req, res) => {
  await PlayerProfile.aggregate([
    {
      $match: { user_id: new mongoose.Types.ObjectId(req["query"].user_id) },
    },
    {
      $lookup: {
        from: "sponsor_profiles",
        localField: "sponsor_list.sponsor_id",
        foreignField: "_id",
        as: "sponsors",
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

//Update User Profile (All) API
const updatePlayerProfile = asyncHandler(async (req, res) => {
  try {
    await PlayerProfile.findById(req["query"].profile_id)
      .then(async (profile) => {
        if (profile !== null) {
          profile.default_ign = req["body"].default_ign || profile.default_ign;
          profile.avatar.cloud_id =
            req["body"].avatar.cloud_id || profile.avatar.cloud_id;
          profile.avatar.name = req["body"].avatar.name || profile.avatar.name;
          profile.avatar.url = req["body"].avatar.url || profile.avatar.url;
          profile.club_id = req["body"].club_id || profile.club_id;
          profile.clan_id = req["body"].clan_id || profile.clan_id;
          profile.local_rank = req["body"].local_rank || profile.local_rank;
          profile.global_rank = req["body"].global_rank || profile.global_rank;
          profile.win_rate = req["body"].win_rate || profile.win_rate;
          profile.toxic_level = req["body"].toxic_level || profile.toxic_level;
          profile.discipline_level =
            req["body"].discipline_level || profile.discipline_level;
          profile.skill_level = req["body"].skill_level || profile.skill_level;
          profile.report_count =
            req["body"].report_count || profile.report_count;
          profile.game_list =
            getGameList(req["body"].game_list) || profile.game_list;
          profile.sponsor_list =
            getSponsorList(req["body"].sponsor_list) || profile.sponsor_list;
          profile.status = req["body"].status || profile.status;
          profile.user_id = req["body"].user_id || profile.user_id;

          await profile
            .save()
            .then(async (profile) => {
              if (profile !== null) {
                await PlayerProfile.find({ status: req["body"]._id })
                  .sort({ length: -1 })
                  .then((value) => {
                    res.status(200).json({ player_profile: value });
                  });
              } else {
                res.status(404).json({ event_RARs: [] });
              }
            })
            .catch((error) => {
              res.status(400).json({ error: error.toString() });
            });
        } else {
          res.status(404).json({ message: "Player profile not found!" });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: error.toString() });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.toString() });
  }
});

const getUnregisteredPlayers = asyncHandler(async (req, res) => {
  try {
    const { keyword, status } = req["query"];

    const userLookup = {
      $lookup: {
        from: "user_profiles",
        localField: "user_id",
        foreignField: "_id",
        as: "user",
      },
    };

    const unwindUser = {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    };

    const matchStatus = {
      $match: {
        "user.status": status,
        $or: [
          { "user.user_name": keyword },
          { "user.email": keyword },
          { "user.mobile": keyword },
          { default_ign: keyword },
        ],
      },
    };

    const projectFields = {
      $project: {
        _id: 0,
        user_id: "$user._id",
        first_name: "$user.first_name",
        last_name: "$user.last_name",
        user_name: "$user.user_name",
        email: "$user.email",
        mobile: "$user.mobile",
        tfa_status: "$user.tfa_status",
        account_type: "$user.account_type",
        play_frequency: "$user.play_frequency",
        reminder_type: "$user.reminder_type",
        player_profile_id: "$_id",
        default_ign: 1,
        avatar: 1,
      },
    };

    const unregisteredPlayers = await PlayerProfile.aggregate([
      userLookup,
      unwindUser,
      matchStatus,
      projectFields,
    ]);

    res.json({ profiles: unregisteredPlayers });
  } catch (err) {
    next(err);
  }
});

const getTNotRegPlayers = asyncHandler(async (req, res) => {
  try {
    // const {keyword, status} = req["query"];
    const userLookup = {
      $lookup: {
        from: "player_teams",
        localField: "_id",
        foreignField: "members.player_profile_id",
        as: "registered",
      },
    };

    const unwindUser = {
      $unwind: {
        path: "$registered",
        preserveNullAndEmptyArrays: true,
      },
    };

    const matchStatus = {
      $match: {
        status: req["query"].status,
        registered: [],
      },
    };

    const projectFields = {
      $project: {
        _id: 1,
        default_ign: 1,
        avatar: 1,
        club_id: 1,
        clan_id: 1,
        local_rank: 1,
        global_rank: 1,
        win_rate: 1,
        toxic_level: 1,
        discipline_level: 1,
        skill_level: 1,
        report_count: 1,
        game_list: 1,
        sponsor_list: 1,
        status: 1,
        user_id: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    };

    await PlayerProfile.aggregate([
      userLookup,
      // unwindUser,
      matchStatus,
      projectFields,
    ])
      .then((value) => {
        res.status(200).json({ profiles: value });
      })
      .catch((reason) => {
        throw reason;
      });
  } catch (reason) {
    console.error(chalk.red(reason));
    res.status(500).json({ error: reason.toString() });
  }
});

const getTRegPlayers = asyncHandler(async (req, res, next) => {
  try {
    // const {keyword, status} = req["query"];

    const userLookup = {
      $lookup: {
        from: "player_teams",
        localField: "_id",
        foreignField: "members.player_profile_id",
        as: "registered",
      },
    };

    const unwindUser = {
      $unwind: {
        path: "$registered",
        preserveNullAndEmptyArrays: true,
      },
    };

    const matchStatus = {
      $match: {
        status: req["query"].status,
        registered: { $ne: [] },
      },
    };

    const projectFields = {
      $project: {
        _id: 1,
        default_ign: 1,
        avatar: 1,
        club_id: 1,
        clan_id: 1,
        local_rank: 1,
        global_rank: 1,
        win_rate: 1,
        toxic_level: 1,
        discipline_level: 1,
        skill_level: 1,
        report_count: 1,
        game_list: 1,
        sponsor_list: 1,
        status: 1,
        user_id: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    };

    await PlayerProfile.aggregate([
      userLookup,
      matchStatus,
      // unwindUser,
      projectFields,
    ])
      .then((value) => {
        res.json({ profiles: value });
      })
      .catch((reason) => {
        console.error(chalk.red(reason.toString()));
      });
  } catch (err) {
    next(err);
  }
});

module.exports = {
  getUnregisteredPlayers,
  getTNotRegPlayers,
  getTRegPlayers,
  createPlayerProfile,
  updatePlayerProfile,
  getPlayerProfileByUserId,
};
