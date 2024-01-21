const asyncHandler = require("express-async-handler");
require("mongoose");
const TournamentEvent = require("../models/tournament_event");
const EventTeamAssign = require("../models/event_team_assign");
const EventAnnouncement = require("../models/event_announcement");
const Event_rar = require("../models/event_rar");
const Event_rac = require("../models/event_rac");
const chalk = require("chalk");

function getArtWorks(value) {
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
    // res.status(500).json({error: e.toString()});
  }
  return ob;
}

function getSelectionGroup(value) {
  const ob = [];
  value.forEach((value) => {
    ob.push({
      group_id: value.group_id,
      type: value.type,
      status: value.status,
      ea_targets: getErarTarget(value.ea_targets),
    });
  });
  return ob;
}

function getErarTarget(value) {
  const ob = [];
  try {
    value.forEach((value) => {
      ob.push({
        target_id: value.target_id,
        status: value.status,
      });
    });
  } catch (e) {
    console.error(e);
    // res.status(500).json({error: e.toString()});
  }
  return ob;
}

function getAttachments(value) {
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
    // res.status(500).json({error: e.toString()});
  }
  return ob;
}

function getEracSelectionGroup(value) {
  const ob = [];
  value.forEach((value) => {
    ob.push({
      type: value.type,
      boundary: value.boundary,
      action: value.action,
      status: value.status,
      erac_targets: getEracTarget(value.erac_targets),
    });
  });
  return ob;
}

function getEracTarget(value) {
  const ob = [];
  try {
    value.forEach((value) => {
      ob.push({
        target_id: value.target_id,
        action: value.action,
      });
    });
  } catch (e) {
    console.error(e);
    // res.status(500).json({error: e.toString()});
  }
  return ob;
}

async function getEvents(req, res) {
  await TournamentEvent.find({
    tournament_id: req["body"].tournament_id,
    status: "Active",
  })
    .then((result) => {
      if (result !== null) {
        res.status(200).json({ events: result });
      } else {
        res.status(404).json({ events: [] });
      }
    })
    .catch((reason) => {
      console.error(reason.toString());
      res.status(500).json({ error: reason.toString() });
    });
}

//create Tournament Event
const createTournamentEvent = asyncHandler(async (req, res) => {
  try {
    const { save } = new TournamentEvent({
      event_name: req["body"].event_name,
      event_type: req["body"].event_type,
      team_type: req["body"].team_type,
      art_works: getArtWorks(req["body"].art_works),
      status: req["body"].status,
      game_id: req["body"].game_id,
      tournament_id: req["body"].tournament_id,
    });

    await save().then(() => {
      getEvents(req, res);
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.toString() });
  }
});

const getAllEvents = asyncHandler(async (req, res) => {
  try {
    let filter;

    if (req["query"].status === "All") {
      filter = {};
    } else {
      filter = {
        status: req["query"].status,
      };
    }

    await TournamentEvent.find(filter)
      .then((result) => {
        if (result !== null) {
          res.status(200).json({ events: result });
        } else {
          res.status(404).json({ events: [] });
        }
      })
      .catch((reason) => {
        console.error(chalk.red(reason.toString()));
        res.status(500).json({ error: reason.toString() });
      });
  } catch (e) {
    console.error(chalk.red(e.toString()));
    res.status(500).json({ error: e.toString() });
  }
});

const getEventsByTournamentId = asyncHandler(async (req, res) => {
  try {
    let filter;

    if (req["query"].status === "All") {
      filter = { tournament_id: req["query"].id };
    } else {
      filter = {
        tournament_id: req["query"].id,
        status: req["query"].status,
      };
    }

    await TournamentEvent.find(filter)
      .then((result) => {
        if (result !== null) {
          res.status(200).json({ events: result });
        } else {
          res.status(404).json({ events: [] });
        }
      })
      .catch((reason) => {
        console.error(chalk.red(reason.toString()));
        res.status(500).json({ error: reason.toString() });
      });
  } catch (e) {
    console.error(chalk.red(e.toString()));
    res.status(500).json({ error: e.toString() });
  }
});

//Update Tournament Event
const updateTournamentEvent = asyncHandler(async (req, res) => {
  try {
    await TournamentEvent.findById(req["query"].id)
      .then(async (tournamentEvent) => {
        if (tournamentEvent) {
          tournamentEvent.event_name =
            req["body"].event_name || tournamentEvent.event_name;
          tournamentEvent.event_type =
            req["body"].event_type || tournamentEvent.event_type;
          tournamentEvent.team_type =
            req["body"].team_type || tournamentEvent.team_type;
          tournamentEvent.art_works =
            getArtWorks(req["body"].art_works) || tournamentEvent.art_works;
          tournamentEvent.status = req["body"].status || tournamentEvent.status;
          tournamentEvent.game_id =
            req["body"].game_id || tournamentEvent.game_id;
          tournamentEvent.tournament_id =
            req["body"].tournament_id || tournamentEvent.tournament_id;

          await tournamentEvent
            .save()
            .then(async () => {
              getEvents(req, res);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).json({ error: error.toString() });
            });
        } else {
          res.status(404).json({ message: "Tournament Event not found!" });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: error.toString() });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.toString() });
  }
});

/*//Delete Tournament Event
const deleteTournamentEvent = asyncHandler(async (req, res) => {
    try {
        await tournamentEvent.findByIdAndDelete(req["query"].id)
            .then(() => {
                getEvents(req, res);
            })
            .catch((err) => {
                throw err;
            });
    } catch (error) {
        res.status(500).json({error: error.toString()});
    }
});*/

//Delete Tournament Event
const deleteTournamentEvent = asyncHandler(async (req, res) => {
  try {
    await TournamentEvent.findById(req["query"].id)
      .then(async (event) => {
        if (event) {
          await TournamentEvent.deleteOne({ _id: req["query"].id })
            .then(async () => {
              await TournamentEvent.find()
                .sort({ length: -1 })
                .then((value) => {
                  res.status(200).json({ events: value });
                });
            })
            .catch((error) => {
              res.status(404).json({ error: error.toString() });
            });
        } else {
          res.status(401).json({ message: "Tournament Event not Found!" });
        }
      })
      .catch((error) => {
        res.status(404).json({ error: error.toString() });
      });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

const assignPlayerTeam = asyncHandler(async (req, res) => {
  try {
    await EventTeamAssign.find({
      $and: [{ ptl_id: req["body"].ptl_id }, { te_id: req["body"].te_id }],
      // ptl_id: req["body"].ptl_id
    })
      .then(async (value) => {
        if (value.length > 0) {
          console.warn(chalk.yellow("Duplicate entry found"));
          res.status(500).json({ error: "Duplicate entry found" });
        } else {
          const eventTeamAssign = new EventTeamAssign({
            status: req["body"].status,
            card_color: req["body"].card_color,
            ptl_id: req["body"].ptl_id,
            te_id: req["body"].te_id,
          });
          await eventTeamAssign
            .save()
            .then(async (result) => {
              if (result !== null) {
                await EventTeamAssign.find()
                  // .sort({length: -1})
                  .then((value) => {
                    if (value) {
                      res.status(200).json({ assigned_teams: value });
                    } else {
                      res.status(404).json({ assigned_teams: value });
                    }
                  })
                  .catch((reason) => {
                    throw reason;
                  });
              }
            })
            .catch((reason) => {
              throw reason;
            });
        }
      })
      .catch((reason) => {
        throw reason;
      });
  } catch (error) {
    console.error(chalk.red(error.toString()));
    res.status(500).json({ error: error.toString() });
  }
});

const assignPlayerTeamToEventList = asyncHandler(async (req, res) => {
  try {
    // const eventList = [];
    const eventListRes = [];

    for (const value of req["body"].eventTeamAssign) {
      const eventTeamAssign = new EventTeamAssign({
        status: value.status,
        card_color: value.card_color,
        ptl_id: value.ptl_id,
        te_id: value.te_id,
      });

      await eventTeamAssign
        .save()
        .then((result) => {
          if (result !== null) {
            // await eventTeamAssign.find({status: req["body"].status})
            //     .sort({length: -1})
            //     .then((value) => {
            //         res.status(200).json({assigned_teams: value});
            //     });
            eventListRes.push(result);
          } else {
            // res.status(404).json({assigned_teams: []});
          }
        })
        .catch((error) => {
          res.status(500).json({ error: error.toString() });
        });
    }

    if (eventListRes.length > 0) {
      await EventTeamAssign.find()
        // .sort({length: -1})
        .then((value) => {
          res.status(200).json({ assigned_teams: value });
        });
    } else {
      res.status(404).json({ assigned_teams: [] });
    }
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

const getAllAssignedPlayerTeamsByEventId = asyncHandler(async (req, res) => {
  try {
    await EventTeamAssign.find({
      te_id: req["query"].te_id,
    })
      .then((assignedTeams) => {
        if (assignedTeams.length > 0) {
          res.status(200).json({ assigned_teams: assignedTeams });
        } else {
          res.status(404).json({ assigned_teams: assignedTeams });
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

const getAssignedPlayerTeamsByPtlId = asyncHandler(async (req, res) => {
  try {
    await EventTeamAssign.find({
      ptl_id: req["query"].ptl_id,
      // status: req["query"].status,
    })
      .then((assignedTeams) => {
        if (assignedTeams.length > 0) {
          res.status(200).json({ assigned_teams: assignedTeams });
        } else {
          res.status(404).json({ assigned_teams: assignedTeams });
        }
      })
      .catch((error) => {
        console.error(chalk.red(error));
        res.status(500).json({ error: error });
      });
  } catch (e) {
    console.error(chalk.red(e));
    res.status(500).json({ error: e.toString() });
  }
});

function getContent_art_works(value) {
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

function getCovering_ids(value) {
  const ob = [];
  try {
    value.forEach((value) => {
      ob.push(value);
    });
  } catch (e) {
    console.error(e);
  }
  return ob;
}

function getEa_selection_group(value) {
  const ob = [];
  try {
    value.forEach((value) => {
      ob.push({
        group_id: value.group_id,
        type: value.type,
        status: value.status,
        ea_targets: getEa_targets(value.ea_targets),
      });
    });
  } catch (e) {
    console.error(e);
  }
  return ob;
}

function getEa_targets(value) {
  const ob = [];
  try {
    value.forEach((value) => {
      ob.push({
        target_id: value.target_id,
        status: value.status,
      });
    });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
  return ob;
}

// Add Event Announcement
const addEventAnnouncement = asyncHandler(async (req, res) => {
  try {
    const newEventAnnouncement = new EventAnnouncement({
      title: req["body"].title,
      type: req["body"].type,
      content_text: req["body"].content_text,
      content_art_works: getContent_art_works(req["body"].content_art_works),
      validate_date_time: req["body"].validate_date_time,
      reminder_type: req["body"].reminder_type,
      reminder_frq: req["body"].reminder_frq,
      cover_area: req["body"].cover_area,
      covering_ids: getCovering_ids(req["body"].covering_ids),
      ea_selection_group: getEa_selection_group(req["body"].ea_selection_group),
      tournament_event_id: req["body"].tournament_event_id,
      status: req["body"].status,
    });

    await newEventAnnouncement
      .save()
      .then(async (result) => {
        if (result !== null) {
          await EventAnnouncement.find({ status: req["body"].status })
            .sort({ length: -1 })
            .then((value) => {
              res.status(200).json({ eventAnnoucement: value });
            });
        } else {
          res.status(404).json({ eventAnnoucement: [] });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: error.toString() });
      });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

//Add Event Rules and Regulations
const createEvent_rar = asyncHandler(async (req, res) => {
  try {
    const newEvent_rar = new Event_rar({
      title: req["body"].title,
      category: req["body"].category,
      content_text: req["body"].content_text,
      validate_date_time: req["body"].validate_date_time,
      cover_area: req["body"].cover_area,
      covering_ids: req["body"].covering_ids,
      ea_selection_group: getSelectionGroup(req["body"].ea_selection_group),
      status: req["body"].status,
      te_id: req["body"].te_id,
      match_id: req["body"].match_id,
    });

    await newEvent_rar.save().then((savedDoc) => {
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

const removeRAROfEvent = asyncHandler(async (req, res) => {
  try {
    await Event_rar.findById(req["query"].id)
      .then(async (event) => {
        if (event) {
          await Event_rar.deleteOne({
            _id: req["query"].id,
            te_id: req["query"].te_id,
          })
            .then(async () => {
              await Event_rar.find().then((event) => {
                res.status(200).json({ event_RARs: event });
              });
            })
            .catch((error) => {
              res.status(404).json({ error: error.toString() });
            });
        } else {
          res.status(401).json({ message: "RAR Of Event not Found!" });
        }
      })
      .catch((error) => {
        res.status(404).json({ error: error.toString() });
      });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// Get All RARs By Event Id
const getAllRARsByEventId = asyncHandler(async (req, res) => {
  try {
    let filter;

    if (req["query"].status === "All") {
      filter = {
        te_id: req["query"].te_id,
        match_id: req["query"].match_id,
      };
    } else {
      filter = {
        te_id: req["query"].te_id,
        match_id: req["query"].match_id,
        status: req["query"].status,
      };
    }

    await Event_rar.find(filter)
      .then((Event) => {
        if (Event.length > 0) {
          res.status(200).json({ event_RARs: Event });
        } else {
          res.status(404).json({ event_RARs: Event });
        }
      })
      .catch((error) => {
        console.error(chalk.red(error.toString()));
        res.status(500).json({ error: error });
      });
  } catch (e) {
    console.error(chalk.red(e));
    res.status(500).json({ error: e.toString() });
  }
});

//Update Event Rules and Regulations
const updateRAROfEvent = asyncHandler(async (req, res) => {
  try {
    await Event_rar.findOne({
      $or: [{ _id: req["query"].id, te_id: req["query"].te_id }],
    })
      .then(async (eventRAR) => {
        if (eventRAR) {
          eventRAR.title = req["body"].title || eventRAR.title;
          eventRAR.category = req["body"].category || eventRAR.category;
          eventRAR.content_text =
            req["body"].content_text || eventRAR.content_text;
          eventRAR.validate_date_time =
            req["body"].validate_date_time || eventRAR.validate_date_time;
          eventRAR.cover_area = req["body"].cover_area || eventRAR.cover_area;
          eventRAR.covering_ids =
            req["body"].covering_ids || eventRAR.covering_ids;
          eventRAR.ea_selection_group =
            getSelectionGroup(req["body"].ea_selection_group) ||
            eventRAR.ea_selection_group;
          eventRAR.status = req["body"].status || eventRAR.status;
          eventRAR.te_id = req["body"].te_id || eventRAR.te_id;
          eventRAR.match_id = req["body"].match_id || eventRAR.match_id;

          await eventRAR
            .save()
            .then(async (result) => {
              if (result !== null) {
                await Event_rar.find({ status: req["body"].status })
                  .sort({ length: -1 })
                  .then((value) => {
                    res.status(200).json({ event_RARs: value });
                  });
              } else {
                res.status(404).json({ event_RARs: [] });
              }
            })
            .catch((error) => {
              res.status(500).json({ error: error.toString() });
            });
        } else {
          res.status(404).json({ message: "Event RAR not found!" });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: error.toString() });
      });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

//Create Report and Complain (All) API
const createEvent_rac = asyncHandler(async (req, res) => {
  try {
    const newEvent_rac = new Event_rac({
      title: req["body"].title,
      category: req["body"].category,
      content_text: req["body"].content_text,
      validate_date_time: req["body"].validate_date_time,
      cover_area: req["body"].cover_area,
      covering_ids: req["body"].covering_ids,
      attachments: getAttachments(req["body"].attachments),
      erac_selection_group: getEracSelectionGroup(
        req["body"].erac_selection_group,
      ),
      te_id: req["body"].te_id,
      match_id: req["body"].match_id,
      reporter_id: req["body"].reporter_id,
      status: req["body"].status,
    });

    await newEvent_rac.save().then((savedDoc) => {
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

//Update Event RACs (Organizer) API
const updateRACOfEvent = asyncHandler(async (req, res) => {
  try {
    await Event_rac.findOne({
      $or: [
        {
          _id: req["query"].id,
          te_id: req["query"].te_id,
          match_id: req["query"].match_id,
        },
      ],
    })
      .then(async (eventRAC) => {
        if (eventRAC) {
          eventRAC.title = req["body"].title || eventRAC.title;
          eventRAC.category = req["body"].category || eventRAC.category;
          eventRAC.content_text =
            req["body"].content_text || eventRAC.content_text;
          eventRAC.validate_date_time =
            req["body"].validate_date_time || eventRAC.validate_date_time;
          eventRAC.cover_area = req["body"].cover_area || eventRAC.cover_area;
          eventRAC.covering_ids =
            req["body"].covering_ids || eventRAC.covering_ids;
          eventRAC.attachments =
            getAttachments(req["body"].attachments) || eventRAC.attachments;
          eventRAC.erac_selection_group =
            getEracSelectionGroup(req["body"].erac_selection_group) ||
            eventRAC.erac_selection_group;
          eventRAC.te_id = req["body"].te_id || eventRAC.te_id;
          eventRAC.match_id = req["body"].match_id || eventRAC.match_id;
          eventRAC.reporter_id =
            req["body"].reporter_id || eventRAC.reporter_id;
          eventRAC.status = req["body"].status || eventRAC.status;

          await eventRAC
            .save()
            .then(async (result) => {
              if (result !== null) {
                await Event_rac.find({ status: req["body"].status })
                  .sort({ length: -1 })
                  .then((value) => {
                    res.status(200).json({ event_RAC: value });
                  });
              } else {
                res.status(404).json({ event_RAC: [] });
              }
            })
            .catch((error) => {
              res.status(500).json({ error: error.toString() });
            });
        } else {
          res.status(404).json({ message: "Event RAC not found!" });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: error.toString() });
      });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

//Remove Event RACs (Organizer) API
const removeRACOfEvent = asyncHandler(async (req, res) => {
  try {
    await Event_rac.findById(req["query"].id)
      .then(async (event) => {
        if (event) {
          await Event_rac.deleteOne({ _id: req["query"].id })
            .then(async () => {
              await Event_rac.find().then((event) => {
                res.status(200).json({ event_RAC: event });
              });
            })
            .catch((error) => {
              res.status(404).json({ error: error.toString() });
            });
        } else {
          res.status(401).json({ message: "RAC Of Event not Found!" });
        }
      })
      .catch((error) => {
        res.status(404).json({ error: error.toString() });
      });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// Get All Event RAC  By RAC Id (All) API
const getAllRACsByRACId = asyncHandler(async (req, res) => {
  try {
    let filter;

    if (req["query"].status === "All") {
      filter = {
        _id: req["query"].id,
      };
    } else {
      filter = {
        _id: req["query"].id,
        status: req["query"].status,
      };
    }

    await Event_rac.find(filter)
      .then((Event) => {
        if (Event.length > 0) {
          res.status(200).json({ event_RAC: Event });
        } else {
          res.status(404).json({ event_RAC: Event });
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

// Get All Event RACs (All) API
const getAllEventRACs = asyncHandler(async (req, res) => {
  try {
    let filter;

    if (req["query"].status === "All") {
      filter = {
        te_id: req["query"].te_id,
      };
    } else {
      filter = {
        te_id: req["query"].te_id,
        status: req["query"].status,
      };
    }

    await Event_rac.find(filter)
      .then((Event) => {
        if (Event.length > 0) {
          res.status(200).json({ event_RACs: Event });
        } else {
          res.status(404).json({ event_RACs: Event });
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

//Resign Event Player Teams (All) API
const resignTeam = asyncHandler(async (req, res) => {
  try {
    await EventTeamAssign.findOne({
      te_id: req["query"].te_id,
      ptl_id: req["query"].ptl_id,
      _id: req["query"].id,
    })
      .then(async (team) => {
        if (team) {
          await EventTeamAssign.deleteOne({
            te_id: req["query"].te_id,
            ptl_id: req["query"].ptl_id,
            _id: req["query"].id,
          })
            .then(async () => {
              await EventTeamAssign.find()
                // .sort({length: -1})
                .then((value) => {
                  if (value) {
                    res.status(200).json({ assigned_teams: value });
                  } else {
                    res.status(404).json({ assigned_teams: [] });
                  }
                })
                .catch((reason) => {
                  throw reason;
                });
            })
            .catch((reason) => {
              throw reason;
            });
        } else {
          console.warn(chalk.yellowBright("Event Player Team not Found!"));
          res.status(404).json({ error: "Event Player Team not Found!" });
        }
      })
      .catch((reason) => {
        throw reason;
      });
  } catch (error) {
    console.error(chalk.red(error.toString()));
    res.status(500).json({ error: error.toString() });
  }
});

// Update Event Assigned Team
const updateEventAssignedTeam = asyncHandler(async (req, res) => {
  console.log(req["query"].id);
  try {
    await EventTeamAssign.findById(req["query"].id)
      .then(async (eventTeamAssign) => {
        if (eventTeamAssign) {
          eventTeamAssign.te_id = req["body"].te_id || eventTeamAssign.te_id;
          eventTeamAssign.ptl_id = req["body"].ptl_id || eventTeamAssign.ptl_id;
          eventTeamAssign.status = req["body"].status || eventTeamAssign.status;
          eventTeamAssign.card_color =
            req["body"].card_color || eventTeamAssign.card_color;

          await eventTeamAssign
            .save()
            .then(async (result) => {
              if (result !== null) {
                await eventTeamAssign
                  .find()
                  // .sort({length: -1})
                  .then((value) => {
                    res.status(200).json({ assinged_teams: value });
                  });
              } else {
                res.status(404).json({ assinged_teams: [] });
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

//Update Event Announcement
const updateEventAnnouncement = asyncHandler(async (req, res) => {
  try {
    await EventAnnouncement.findById(req["query"].id)
      .then(async (announcement) => {
        if (announcement !== null) {
          announcement.title = req["body"].title || announcement.title;
          announcement.type = req["body"].type || announcement.type;
          announcement.content_text =
            req["body"].content_text || announcement.content_text;
          announcement.content_art_works =
            getContent_art_works(req["body"].content_art_works) ||
            announcement.content_art_works;
          announcement.validate_date_time =
            req["body"].validate_date_time || announcement.validate_date_time;
          announcement.reminder_type =
            req["body"].reminder_type || announcement.reminder_type;
          announcement.reminder_frq =
            req["body"].reminder_frq || announcement.reminder_frq;
          announcement.cover_area =
            req["body"].cover_area || announcement.cover_area;
          announcement.covering_ids =
            getCovering_ids(req["body"].covering_ids) ||
            announcement.covering_ids;
          announcement.ea_selection_group =
            getEa_selection_group(req["body"].ea_selection_group) ||
            announcement.ea_selection_group;
          announcement.status = req["body"].status || announcement.status;

          await announcement
            .save()
            .then(async (announcement) => {
              if (announcement !== null) {
                await EventAnnouncement.find({ status: req["body"].status })
                  .sort({ length: -1 })
                  .then((value) => {
                    res.status(200).json({ announcement: value });
                  });
              } else {
                res.status(404).json({ announcement: [] });
              }
            })
            .catch((error) => {
              res.status(500).json({ error: error.toString() });
            });
        } else {
          res.status(404).json({ message: "Announcement not found!" });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: error.toString() });
      });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

const getAllAnnouncementsOfEvent = asyncHandler(async (req, res) => {
  try {
    let filter;

    if (req["query"].status === "All") {
      filter = {};
    } else {
      filter = {
        status: req["query"].status,
      };
    }

    await EventAnnouncement.find(filter)
      .then((result) => {
        if (result !== null) {
          res.status(200).json({ events: result });
        } else {
          res.status(404).json({ events: [] });
        }
      })
      .catch((reason) => {
        console.error(chalk.red(reason.toString()));
        res.status(500).json({ error: reason.toString() });
      });
  } catch (e) {
    console.error(chalk.red(e.toString()));
    res.status(500).json({ error: e.toString() });
  }
});

module.exports = {
  createTournamentEvent,
  getAllEvents,
  getEventsByTournamentId,
  updateTournamentEvent,
  deleteTournamentEvent,
  assignPlayerTeam,
  assignPlayerTeamToEventList,
  getAllAssignedPlayerTeamsByEventId,
  addEventAnnouncement,
  createEvent_rar,
  removeRAROfEvent,
  getAllRARsByEventId,
  updateRAROfEvent,
  createEvent_rac,
  updateRACOfEvent,
  removeRACOfEvent,
  getAllRACsByRACId,
  getAllEventRACs,
  resignTeam,
  updateEventAssignedTeam,
  updateEventAnnouncement,
  getAllAnnouncementsOfEvent,
  getAssignedPlayerTeamsByPtlId,
};
