const asyncHandler = require("express-async-handler");
const chalk = require("chalk");

const Tournament = require("../models/tournament");
const tournament = require("../models/tournament");
const PlayerTeams = require("../models/player_teams");
const Organization = require("../models/organization");
const Sponsor = require("../models/sponsor_profile");
const playerTeam = require("../models/player_teams");
const mongoose = require("mongoose");

function getArtWorks(value) {
  const ob = [];
  try {
    if (value.length != 0) {
      value.forEach((value) => {
        if (value.cloud_id != "") {
          ob.push({
            cloud_id: value.cloud_id,
            name: value.name,
            url: value.url,
          });
        }
      });
    }
  } catch (e) {
    console.error(e);
  }
  return ob;
}

function getTO_list(value) {
  const ob = [];
  if (value.length != 0) {
    value.forEach((value) => {
      if (value.organization_id != "") {
        ob.push({
          organization_id: value.organization_id,
          type: value.type,
          role: value.role,
          status: value.status,
        });
      }
    });
  }

  return ob;
}

function getTS_list(value) {
  const ob = [];
  if (value.length != 0) {
    value.forEach((value) => {
      if (value.sponsor_id != "") {
        ob.push({
          sponsor_id: value.sponsor_id,
          type: value.type,
          coverage: value.coverage,
          status: value.status,
        });
      }
    });
  }
  return ob;
}

function getTCT_List(value) {
  const ob = [];
  if (value.length != 0) {
    value.forEach((value) => {
      if (value.code != "") {
        ob.push({
          code: value.code,
          name: value.name,
          avatar: value.avatar,
          role: value.role,
          status: value.status,
          members: getTCT_Members(value.members),
        });
      }
    });
  }

  return ob;
}

function getTCT_Members(value) {
  const ob = [];
  try {
    if (value.length > 0) {
      value.forEach((value) => {
        if (value.user_id != "") {
          ob.push({
            user_id: value.user_id,
            role: value.role,
            status: value.status,
          });
        }
      });
    }
  } catch (e) {
    console.error(e);
    // res.status(500).json({error: e.toString()});
  }
  return ob;
}

function getTeamGroups(value) {
  const ob = [];
  if (value.length != 0) {
    value.forEach((value) => {
      if (value.code != "") {
        ob.push({
          code: value.code,
          name: value.name,
          status: value.status,
        });
      }
    });
  }

  return ob;
}

function getTeamSides(value) {
  const ob = [];
  if (value.length != 0) {
    value.forEach((value) => {
      if (value.side != "") {
        ob.push({
          side: value.side,
          name: value.name,
          status: value.status,
        });
      }
    });
  }

  return ob;
}

function getTG_List(value) {
  const ob = [];
  if (value.length != 0) {
    value.forEach((value) => {
      if (value.game_id != "") {
        ob.push({
          status: value.status,
          game_id: value.game_id,
        });
      }
    });
  }

  return ob;
}

function getTFD_List(value) {
  const ob = [];
  if (value.length != 0) {
    value.forEach((value) => {
      if (value.account_number != "") {
        ob.push({
          type: value.type,
          bank: value.bank,
          branch: value.branch,
          account_number: value.account_number,
          account_holder: value.account_holder,
          status: value.status,
        });
      }
    });
  }

  return ob;
}

async function getTournaments(req, res) {
  await Tournament.find({
    tct_list: { members: req.body.tct_list.members.user_id },
  }).exec((error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: error });
    } else {
      if (result !== null) {
        res.status(200).json({ sponsors: result });
      } else {
        res.status(404).json({ sponsors: [] });
      }
    }
  });
}

const createTournament = asyncHandler(async (req, res) => {
  try {
    const newTournament = new Tournament({
      name: req.body.name,
      start_date: req.body.start_date,
      start_time: req.body.start_time,
      end_date: req.body.end_date,
      end_time: req.body.end_time,
      reg_open_date: req.body.reg_open_date,
      reg_open_time: req.body.reg_open_time,
      reg_close_date: req.body.reg_close_date,
      reg_close_time: req.body.reg_close_time,
      art_works: getArtWorks(req.body.art_works),
      type: req.body.type,
      participant_type: req.body.participant_type,
      status: req.body.status,
      to_list: getTO_list(req.body.to_list),
      ts_list: getTS_list(req.body.ts_list),
      tct_list: getTCT_List(req.body.tct_list),
      team_groups: getTeamGroups(req.body.team_groups),
      team_sides: getTeamSides(req.body.team_sides),
      tg_list: getTG_List(req.body.tg_list),
      finance_details: getTFD_List(req.body.finance_details),
    });

    await newTournament.save().then((savedDoc) => {
      if (savedDoc !== null) {
        res.status(201).json(savedDoc);
      } else {
        res.status(500).json({ error: "Save Fail..!" });
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.toString() });
  }
});

const deleteTournament = asyncHandler(async (req, res) => {
  try {
    await tournament
      .deleteOne({ _id: req.body._id })
      .then(() => {
        res.status(200).json("Deleted Successfully !");
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

const updateTournament = asyncHandler(async (req, res) => {
  try {
    await tournament
      .findById(req.body._id)
      .then(async (tournament) => {
        if (tournament !== null) {
          (tournament.name = req.body.name || tournament.name),
            (tournament.start_date =
              req.body.start_date || tournament.start_date),
            (tournament.start_time =
              req.body.start_time || tournament.start_time),
            (tournament.end_date = req.body.end_date || tournament.end_date),
            (tournament.end_time = req.body.end_time || tournament.end_time),
            (tournament.reg_open_date =
              req.body.reg_open_date || tournament.reg_open_date),
            (tournament.reg_open_time =
              req.body.reg_open_time || tournament.reg_open_time),
            (tournament.reg_close_date =
              req.body.reg_close_date || tournament.reg_close_date),
            (tournament.reg_close_time =
              req.body.reg_close_time || tournament.reg_close_time),
            (tournament.art_works =
              getArtWorks(req.body.art_works) || tournament.art_works),
            (tournament.type = req.body.type || tournament.type),
            (tournament.participant_type =
              req.body.participant_type || tournament.participant_type),
            (tournament.status = req.body.status || tournament.status),
            (tournament.to_list =
              getTO_list(req.body.to_list) || tournament.to_list),
            (tournament.ts_list =
              getTS_list(req.body.ts_list) || tournament.ts_list),
            (tournament.tct_list =
              getTCT_List(req.body.tct_list) || tournament.tct_list),
            (tournament.team_groups =
              getTeamGroups(req.body.team_groups) || tournament.team_groups),
            (tournament.team_sides =
              getTeamSides(req.body.team_sides) || tournament.team_sides),
            (tournament.tg_list =
              getTG_List(req.body.tg_list) || tournament.tg_list),
            await tournament
              .save()
              .then((savedDoc) => {
                res.status(200).json(savedDoc);
              })
              .catch((reason) => {
                throw reason;
              });
        } else {
          res.status(404).json(tournament);
        }
      })
      .catch((reason) => {
        throw reason;
      });
  } catch (error) {
    console.error(chalk.red(error));
    res.status(500).json({ error: error.toString() });
  }
});

const addTCTeam = asyncHandler(async (req, res) => {
  try {
    await tournament
      .updateOne(
        { _id: req.query.id },
        {
          $push: {
            tct_list: {
              code: req.body.code,
              name: req.body.name,
              avatar: {
                cloud_id: req.body.avatar.cloud_id,
                name: req.body.avatar.name,
                url: req.body.avatar.url,
              },
              role: req.body.role,
              status: req.body.status,
              members: getTCT_Members(req.body.members),
            },
          },
        },
      )
      .then((savedDoc) => {
        res.status(200).json(savedDoc);
      })
      .catch((reason) => {
        throw reason;
      });
  } catch (error) {
    console.error(chalk.red(error));
    res.status(500).json({ error: error.toString() });
  }
});

const getTCTeams = asyncHandler(async (req, res) => {
  try {
    const query = {
      $match: { _id: new mongoose.Types.ObjectId(req.query.id) },
    };

    const projectFields = {
      $project: {
        _id: 0,
        tct_list: 1,
      },
    };

    await tournament
      .aggregate([query, projectFields])
      .then((teams) => {
        if (teams.length > 0) {
          res.status(200).json(teams[0]);
        } else {
          console.warn(chalk.yellow("No coordinator teams found 😮😥 !"));
          res.status(404).json({ error: "No coordinator teams found 😮😥 !" });
        }
      })
      .catch((reason) => {
        throw reason;
      });
  } catch (error) {
    console.error(chalk.red(error));
    res.status(500).json({ error: error.toString() });
  }
});

async function getOrganizers(orgIds, executeList) {
  let organizers = [];
  await Organization.find({ _id: { $in: orgIds } })
    .then((result) => {
      if (result.length > 0) {
        organizers = result;
      } else {
        organizers = result;
      }
      executeList["organizer"] = true;
    })
    .catch((reason) => {
      executeList["organizer"] = false;
      throw reason;
    });
  return organizers;
}

async function getSponsors(sponIds, executeList) {
  let sponsors = [];
  await Sponsor.find({ _id: { $in: sponIds } })
    .then((result) => {
      if (result.length > 0) {
        sponsors = result;
      } else {
        sponsors = result;
      }
      executeList["sponsor"] = true;
    })
    .catch((reason) => {
      executeList["sponsor"] = false;
      throw reason;
    });
  return sponsors;
}

function prepareResponse(
  executeList,
  resTList,
  tournament,
  organizers,
  sponsors,
) {
  if (executeList["organizer"] == true && executeList["sponsor"] == true) {
    resTList.push({
      tournament: tournament,
      organizers: organizers,
      sponsors: sponsors,
    });

    tournament = [];
    organizers = [];
    sponsors = [];
  }
}

const getTournamentsByTCMemberId = asyncHandler(async (req, res) => {
  try {
    const executeList = {};

    await tournament
      .find({ "tct_list.members.user_id": req.query.id })
      .then(async (tournamentList) => {
        const resTList = [];

        for (const tonaElement of tournamentList) {
          executeList["organizer"] = false;
          executeList["sponsor"] = false;

          const orgIds = [];
          const sponIds = [];

          let sponsors = [];
          let organizers = [];

          tonaElement.to_list.forEach((organizer) => {
            orgIds.push(organizer.organization_id);
          });

          tonaElement.ts_list.forEach((sponsor) => {
            sponIds.push(sponsor.sponsor_id);
          });

          // console.info(chalk.green('Organizer Ids: ' + orgIds));
          // console.info(chalk.green('Organizer Ids: ' + sponIds));

          await getOrganizers(orgIds, executeList).then((value) => {
            organizers = value;
            // console.info(chalk.green('Organizer : ' + organizers));
            // console.info(chalk.green(executeList['organizer']));
            prepareResponse(
              executeList,
              resTList,
              tonaElement,
              organizers,
              sponsors,
            );
          });

          await getSponsors(sponIds, executeList).then((value) => {
            sponsors = value;
            // console.info(chalk.green('Sponsor : ' + sponsors));
            // console.info(chalk.green(executeList['sponsor']));
            prepareResponse(
              executeList,
              resTList,
              tonaElement,
              organizers,
              sponsors,
            );
          });
        }

        res.status(200).json({ tournaments: resTList });
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

function getMembers(value) {
  const ob = [];
  try {
    value.forEach((value) => {
      ob.push({
        is_leader: value.is_leader,
        remark: value.remark,
        status: value.status,
        default_ign: value.default_ign,
        player_profile_id: value.player_profile_id,
      });
    });
  } catch (e) {
    console.error(e);
  }
  return ob;
}

// Player Registration
const playerTeamRegistration = asyncHandler(async (req, res) => {
  try {
    const newPlayerTeams = new PlayerTeams({
      name: req.body.name,
      code: req.body.code,
      logo: {
        cloud_id: req.body.logo.cloud_id,
        name: req.body.logo.name,
        url: req.body.logo.url,
      },
      team_type: req.body.team_type,
      clan_id: req.body.clan_id,
      club_id: req.body.club_id,
      members: getMembers(req.body.members),
      status: req.body.status,
      tournament_id: req.body.tournament_id,
    });

    await newPlayerTeams
      .save()
      .then(async (result) => {
        if (result !== null) {
          res.status(201).json(result);

          /*await PlayerTeams.find({status: req.body.status})
                                  .sort({length: -1})
                                  .then((value) => {
                                      res.status(201).json({player_teams: value});
                                  });*/
        } else {
          res.status(404).json(result);
        }
      })
      .catch((error) => {
        res.status(500).json({ error: error.toString() });
      });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

const getRegisteredPlayerTeams = asyncHandler(async (req, res) => {
  try {
    await PlayerTeams.find({
      tournament_id: req.query.tournament_id,
      status: req.query.status,
    })
      .then((value) => {
        res.status(200).json({ player_teams: value });
      })
      .catch((error) => {
        res.status(500).json({ error: error.toString() });
      });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

//Update Tournament Player Teams
const updateTournamentPlayerTeam = asyncHandler(async (req, res) => {
  try {
    await PlayerTeams.findById(req.body._id)
      .then(async (playerTeam) => {
        if (playerTeam) {
          playerTeam.name = req.body.name || playerTeam.name;
          playerTeam.code = req.body.code || playerTeam.code;
          playerTeam.logo.cloud_id =
            req.body.logo.cloud_id || playerTeam.logo.cloud_id;
          playerTeam.logo.name = req.body.logo.name || playerTeam.logo.name;
          playerTeam.logo.url = req.body.logo.url || playerTeam.logo.url;
          playerTeam.team_type = req.body.team_type || playerTeam.team_type;
          playerTeam.clan_id = req.body.clan_id || playerTeam.clan_id;
          playerTeam.club_id = req.body.club_id || playerTeam.club_id;
          playerTeam.members =
            getMembers(req.body.members) || playerTeam.members;
          playerTeam.status = req.body.status || playerTeam.status;
          playerTeam.tournament_id =
            req.body.tournament_id || playerTeam.tournament_id;

          await playerTeam
            .save()
            .then(async (result) => {
              if (result !== null) {
                res.status(200).json(result);
                /*await PlayerTeams.find()
                                                    .sort({length: -1})
                                                    .then((value) => {
                                                        res.status(200).json({player_teams: value});
                                                    });*/
              } else {
                res.status(404).json(result);
              }
            })
            .catch((error) => {
              res.status(500).json({ error: error.toString() });
            });
        } else {
          res.status(404).json({ message: "Team not found!" });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: error.toString() });
      });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

const resignPlayer = asyncHandler(async (req, res) => {
  try {
    await playerTeam
      .findById(req.query.id, req.query.player_id)
      .then(async (resignplayer) => {
        if (resignplayer) {
          resignplayer.name = "";
          resignplayer.code = "";
          resignplayer.logo = {
            cloud_id: resignplayer.logo.cloud_id,
            name: resignplayer.logo.name,
            url: resignplayer.logo.url,
          };
          resignplayer.team_type = "";
          resignplayer.status = req.body.status || resignplayer.status;
          resignplayer.members = req.body.members || resignplayer.members;
          await resignplayer
            .save()
            .then(async (result) => {
              if (result !== null) {
                await playerTeam
                  .find()
                  .sort({ length: -1 })
                  .then((value) => {
                    res.status(200).json({ resign_player: value });
                  });
              } else {
                res.status(404).json({ resign_player: [] });
              }
            })
            .catch((error) => {
              res.status(500).json({ error: error.toString() });
            });
        } else {
          res.status(404).json({ message: "Event Team Assign not found!" });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: error.toString() });
      });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = {
  createTournament,
  deleteTournament,
  updateTournament,
  getTournamentsByTCMemberId,
  playerTeamRegistration,
  getRegisteredPlayerTeams,
  updateTournamentPlayerTeam,
  resignPlayer,
  addTCTeam,
  getTCTeams,
};
