const asyncHandler = require("express-async-handler");

const eventMatches = require("../models/event_matches");
const assignMatchTeam = require("../models/match_team");

const url = require("url");
const chalk = require("chalk");

function getMatchPlaceImages(value) {
  const ob = [];
  value.forEach((value) => {
    ob.push({
      cloud_id: value.cloud_id,
      name: value.name,
      url: value.url,
    });
  });
  // console.info(ob);
  return ob;
}

function getWinTeams(value) {
  // console.info(value);
  const ob = [];
  value.forEach((value) => {
    ob.push({
      match_teams_id: value.match_teams_id,
      place: value.place,
    });
  });
  // console.info(ob);
  return ob;
}

function getAwards(value) {
  const ob = [];
  value.forEach((value) => {
    ob.push({
      awards_id: value.awards_id,
      winner_type: value.winner_type,
      winner_id: value.winner_id,
    });
  });
  return ob;
}

function getMemberScore(value) {
  const ob = [];
  value.forEach((value) => {
    ob.push({
      member_id: value.member_id,
      toxic_level: value.toxic_level,
      total_damage: value.total_damage,
      total_kills: value.total_kills,
      win_rate: value.win_rate,
      sikll_level: value.sikll_level,
      place: value.place,
      total_points: value.total_points,
      overrall_score: value.overrall_score,
      remark: value.remark,
    });
  });
  // console.info(ob);
  return ob;
}

async function getEventMatches(req, res) {
  await eventMatches
    .find({
      te_id: req["body"].te_id,
    })
    .then((result) => {
      if (result !== null) {
        res.status(200).json({ event_matches: result });
      } else {
        res.status(404).json({ event_matches: [] });
      }
    })
    .catch((reason) => {
      console.error(reason);
      res.status(500).json({ error: reason.toString() });
    });
}

const createEventMatches = asyncHandler(async (req, res) => {
  try {
    const newEventMatches = new eventMatches({
      name: req["body"].name,
      start_date: req["body"].start_date,
      start_time: req["body"].start_time,
      end_date: req["body"].end_date,
      end_time: req["body"].end_time,
      status: req["body"].status,
      te_id: req["body"].te_id,
      tournament_id: req["body"].tournament_id,
      match_place: {
        address: req["body"].match_place.address,
        gps_location: req["body"].match_place.gps_location,
        images: getMatchPlaceImages(req["body"].match_place.images),
      },
      match_results: {
        win_teams: getWinTeams(req["body"].match_results.win_teams),
        awards: getAwards(req["body"].match_results.awards),
      },
    });

    await newEventMatches
      .save()
      .then(async (result) => {
        if (result !== null) {
          /*await eventMatches.find({}).then((savedDocs) => {
                                                                          res.status(200).json({ matches: savedDocs });
                                                                        });*/
          getEventMatches(req, res);
        } else {
          res.status(404).json({ matches: [] });
        }
      })
      .catch((error) => {
        console.error(chalk.red(error.toString()));
        res.status(500).json({ error: error });
      });
  } catch (e) {
    console.error(chalk.red(e.toString()));
    res.status(500).json({ error: e.toString() });
  }
});

const updateEventMatches = asyncHandler(async (req, res) => {
  try {
    await eventMatches
      .findById(req["query"].id)
      .then(async (result) => {
        if (result !== null) {
          result.name = req["body"].name || result.name;
          result.start_date = req["body"].start_date || result.start_date;
          result.start_time = req["body"].start_time || result.start_time;
          result.end_date = req["body"].end_date || result.end_date;
          result.end_time = req["body"].end_time || result.end_time;
          result.status = req["body"].status || result.status;
          result.te_id = req["body"].te_id || result.te_id;
          result.tournament_id =
            req["body"].tournament_id || result.tournament_id;
          result.match_place.address =
            req["body"].match_place.address || result.match_place.address;
          result.match_place.gps_location =
            req["body"].match_place.gps_location || result.match_place.address;
          result.match_place.images =
            getMatchPlaceImages(req["body"].match_place.images) ||
            result.match_place.images;
          result.match_results.win_teams =
            getWinTeams(req["body"].match_results.win_teams) ||
            result.match_results.win_teams;
          result.match_results.awards =
            getAwards(req["body"].match_results.awards) ||
            result.match_results.awards;

          await result
            .save()
            .then(() => {
              getEventMatches(req, res);
            })
            .catch((error) => {
              console.error(chalk.red(e.toString()));
              res.status(400).json({ error: error });
            });
        } else {
          res.status(404).json({ message: "Event Matches not Found!" });
        }
      })
      .catch((error) => {
        console.error(chalk.red(error.toString()));
        throw error;
      });
  } catch (error) {
    console.error(chalk.red(error.toString()));
    res.status(500).json({ error: error });
  }
});

const deleteEventMatches = asyncHandler(async (req, res) => {
  var { query } = url.parse(req.url, true);

  try {
    await eventMatches
      .findById(query.id)
      .then(async (match) => {
        if (match) {
          if (match.te_id === query.te_id) {
            await eventMatches
              .deleteOne({ _id: query.id })
              .then(async (result) => {
                if (result !== null) {
                  await eventMatches
                    .find({ status: req["body"].status })
                    .sort({ length: -1 })
                    .then((match) => {
                      res.status(200).json({ matches: match });
                    });
                } else {
                  res.status(401).json({ message: "Deletion Faild" });
                }
              })
              .catch((err) => {
                console.error(chalk.red(err.toString()));
                res.status(400).json(err);
              });
          } else {
            res.status(401).json({ message: "Match team not Found!" });
          }
        } else {
          res.status(401).json({ message: "Match not Found!" });
        }
      })
      .catch((error) => {
        console.error(chalk.red(error.toString()));
        res.status(404).json({ error: error });
      });
  } catch (error) {
    console.error(chalk.red(error.toString()));
    res.status(500).json({ error: error });
  }
});

const getAllMatchesByTournamentId = asyncHandler(async (req, res) => {
  try {
    let filter;

    if (req["query"].status === "All") {
      filter = {
        tournament_id: req["query"].tournament_id,
      };
    } else {
      filter = {
        tournament_id: req["query"].tournament_id,
        status: req["query"].status,
      };
    }

    await eventMatches
      .find(filter)
      .then((result) => {
        if (result.length > 0) {
          res.status(200).json({ eventMatches: result });
        } else {
          res.status(404).json({ eventMatches: result });
        }
      })
      .catch((error) => {
        console.error(chalk.red(error.toString()));
        res.status(500).json({ error: error });
      });
  } catch (e) {
    console.error(chalk.red(e.toString()));
    res.status(500).json({ error: e.toString() });
  }
});

const getAllMatchesByEventId = asyncHandler(async (req, res) => {
  try {
    let filter;

    if (req["query"].status === "All") {
      filter = {
        te_id: req["query"].te_id,
        tournament_id: req["query"].tournament_id,
      };
    } else {
      filter = {
        te_id: req["query"].te_id,
        tournament_id: req["query"].tournament_id,
        status: req["query"].status,
      };
    }

    await eventMatches
      .find(filter)
      .then((result) => {
        if (result.length > 0) {
          res.status(200).json({ eventMatches: result });
        } else {
          res.status(404).json({ eventMatches: result });
        }
      })
      .catch((error) => {
        console.error(chalk.red(error.toString()));
        res.status(500).json({ error: error });
      });
  } catch (e) {
    console.error(chalk.red(e.toString()));
    res.status(500).json({ error: e.toString() });
  }
});

const getMatchDetailsByMatchId = asyncHandler(async (req, res) => {
  try {
    await eventMatches
      .find({ _id: req["query"].id, te_id: req["query"].te_id })

      .then((result) => {
        if (result.length > 0) {
          res.status(200).json({ result });
        } else {
          res.status(404).json({ result });
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

const Get_All_Teams_Of_Match = asyncHandler(async (req, res) => {
  try {
    await assignMatchTeam
      .find({ match_id: req["query"].match_id })

      .then((result) => {
        if (result.length > 0) {
          res.status(200).json({ result });
        } else {
          res.status(404).json({ result });
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

const createAssignMatchTeam = asyncHandler(async (req, res) => {
  try {
    const newAssignMatchTeam = new assignMatchTeam({
      remark: req["body"].remark,
      status: req["body"].status,
      match_id: req["body"].match_id,
      mc_profile_id: req["body"].mc_profile_id,
      eta_id: req["body"].eta_id,
      team_side_id: req["body"].team_side_id,
      team_group_id: req["body"].team_group_id,
      team_score: {
        toxic_level: req["body"].team_score.toxic_level,
        total_damage: req["body"].team_score.total_damage,
        win_rate: req["body"].team_score.win_rate,
        skill_level: req["body"].team_score.skill_level,
        place: req["body"].team_score.place,
        total_points: req["body"].team_score.total_points,
        overall_score: req["body"].team_score.overall_score,
        remark: req["body"].team_score.remark,
      },
      member_score: getMemberScore(req["body"].member_score),
    });

    await newAssignMatchTeam
      .save()
      .then(async (result) => {
        if (result !== null) {
          await assignMatchTeam
            .find({
              te_id: req["body"].te_id,
              match_id: req["body"].match_id,
            })
            .sort({ length: -1 })
            .then((value) => {
              res.status(200).json({ assign_match_team: value });
            });
        } else {
          res.status(404).json({ assign_match_team: [] });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

//Update Match Team Result
const updateMatchTeamResult = asyncHandler(async (req, res) => {
  try {
    await assignMatchTeam
      .findById(req["query"].match_team_id)
      .then(async (matchTeam) => {
        if (matchTeam) {
          matchTeam.team_score.toxic_level =
            req["body"].team_score.toxic_level ||
            matchTeam.team_score.toxic_level;
          matchTeam.team_score.total_damage =
            req["body"].team_score.total_damage ||
            matchTeam.team_score.total_damage;
          matchTeam.team_score.win_rate =
            req["body"].team_score.win_rate || matchTeam.team_score.win_rate;
          matchTeam.team_score.skill_level =
            req["body"].team_score.skill_level ||
            matchTeam.team_score.skill_level;
          matchTeam.team_score.place =
            req["body"].team_score.place || matchTeam.team_score.place;
          matchTeam.team_score.total_points =
            req["body"].team_score.total_points ||
            matchTeam.team_score.total_points;
          matchTeam.team_score.overall_score =
            req["body"].team_score.overall_score ||
            matchTeam.team_score.overall_score;
          matchTeam.team_score.remark =
            req["body"].team_score.remark || matchTeam.team_score.remark;
          matchTeam.member_score =
            getMemberScore(req["body"].member_score) || matchTeam.member_score;

          await matchTeam
            .save()
            .then(async (result) => {
              if (result !== null) {
                await assignMatchTeam
                  .find()
                  .sort({ length: -1 })
                  .then((value) => {
                    res.status(200).json({ match_teams: value });
                  });
              } else {
                res.status(404).json({ match_teams: [] });
              }
            })
            .catch((error) => {
              res.status(500).json({ error: error });
            });
        } else {
          res.status(404).json({ message: "Match team not found!" });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//Update Match Team Member Score
const updateMatchTeamMemberScore = asyncHandler(async (req, res) => {
  try {
    await assignMatchTeam
      .findOne({ _id: req["query"].match_team_id })
      .then(async (matchTeam) => {
        if (matchTeam) {
          const memberToUpdate = matchTeam.member_score.find(
            (member) => member.member_id === req["query"].member_id,
          );

          if (memberToUpdate) {
            memberToUpdate.toxic_level =
              req["body"].member_score.toxic_level ||
              memberToUpdate.toxic_level;
            memberToUpdate.total_damage =
              req["body"].member_score.total_damage ||
              memberToUpdate.total_damage;
            memberToUpdate.total_kills =
              req["body"].member_score.total_kills ||
              memberToUpdate.total_kills;
            memberToUpdate.win_rate =
              req["body"].member_score.win_rate || memberToUpdate.win_rate;
            memberToUpdate.skill_level =
              req["body"].member_score.skill_level ||
              memberToUpdate.skill_level;
            memberToUpdate.is_mvp =
              req["body"].member_score.is_mvp || memberToUpdate.is_mvp;
            memberToUpdate.place =
              req["body"].member_score.place || memberToUpdate.place;
            memberToUpdate.total_points =
              req["body"].member_score.total_points ||
              memberToUpdate.total_points;
            memberToUpdate.overall_score =
              req["body"].member_score.overall_score ||
              memberToUpdate.overall_score;
            memberToUpdate.remark =
              req["body"].member_score.remark || memberToUpdate.remark;

            await matchTeam
              .save()
              .then(async (result) => {
                if (result !== null) {
                  await assignMatchTeam
                    .find()
                    .sort({ length: -1 })
                    .then((value) => {
                      res.status(200).json({ match_teams: value });
                    });
                } else {
                  res.status(404).json({ match_teams: [] });
                }
              })
              .catch((error) => {
                res.status(500).json({ error: error });
              });
          } else {
            res.status(404).json({ message: "Member not found!" });
          }
        } else {
          res.status(404).json({ message: "Match team not found!" });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

const getAllAssignedTeamsOfMatch = asyncHandler(async (req, res) => {
  try {
    await assignMatchTeam
      .find({
        match_id: req["query"].match_id,
        te_id: req["query"].te_id,
        status: req["query"].status,
      })
      .then((result) => {
        if (result.length > 0) {
          res.status(200).json({ result });
        } else {
          res.status(404).json({ result });
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

module.exports = {
  createEventMatches,
  deleteEventMatches,
  updateEventMatches,
  getAllMatchesByEventId,
  getMatchDetailsByMatchId,
  createAssignMatchTeam,
  Get_All_Teams_Of_Match,
  updateMatchTeamResult,
  updateMatchTeamMemberScore,
  getAllAssignedTeamsOfMatch,
  getAllMatchesByTournamentId,
};
