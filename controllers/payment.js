const asyncHandler = require("express-async-handler");
const chalk = require("chalk");
const mongoose = require("mongoose");
const Payment = require("../models/payment");

function getAttachments(value) {
  const ob = [];
  try {
    if (value.length > 0) {
      value.forEach((value) => {
        if (value.cloud_id !== "") {
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

//Create Tournament Payment
const addTPayment = asyncHandler(async (req, res) => {
  try {
    const newPayment = new Payment({
      pay_amount: req["body"].pay_amount,
      pay_methode: req["body"].pay_methode,
      payer_type: req["body"].payer_type,
      payer_id: req["body"].payer_id,
      target_type: req["body"].target_type,
      target_id: req["body"].target_id,
      ref_number: req["body"].ref_number,
      attachments: getAttachments(req["body"].attachments),
      pay_reason: req["body"].pay_reason,
      pay_reason_id: req["body"].pay_reason_id,
      remark: req["body"].remark,
      trace: req["body"].trace,
      approve_status: req["body"].approve_status,
    });

    await newPayment
      .save()
      .then((savedDoc) => {
        if (savedDoc !== null) {
          res.status(201).json(savedDoc);
        } else {
          res.status(404).json({});
        }
      })
      .catch((error) => {
        console.error(chalk.red(error.toString()));
        res.status(500).json({ error: error });
      });
  } catch (error) {
    console.error(chalk.red(error.toString()));
    res.status(500).json({ error: error.toString() });
  }
});

//Get all Tournament Payment
const getAllTPayments = asyncHandler(async (req, res) => {
  try {
    let filter;

    if (req["query"].status === "All") {
      filter = {};
    } else {
      filter = {
        status: req["query"].status,
      };
    }

    await Payment.find(filter)
      .then((filteredDoc) => {
        if (filteredDoc.length > 0) {
          res.status(200).json({ payments: filteredDoc });
        } else {
          res.status(404).json({ payments: filteredDoc });
        }
      })
      .catch((error) => {
        console.error(chalk.red(error.toString()));
        res.status(500).json({ error: error });
      });
  } catch (error) {
    console.error(chalk.red(error.toString()));
    res.status(500).json({ error: error.toString() });
  }
});

//Update Tournament Payment
const updateTPayment = asyncHandler(async (req, res) => {
  try {
    await Payment.findById(req["query"].id)
      .then(async (payment) => {
        if (payment !== null) {
          payment.pay_amount = req["body"].pay_amount || payment.pay_amount;
          payment.pay_methode = req["body"].pay_methode || payment.pay_methode;
          payment.payer_type = req["body"].payer_type || payment.payer_type;
          payment.payer_id = req["body"].payer_id || payment.payer_id;
          payment.target_type = req["body"].target_type || payment.target_type;
          payment.target_id = req["body"].target_id || payment.target_id;
          payment.ref_number = req["body"].ref_number || payment.ref_number;
          payment.attachments =
            getAttachments(req["body"].attachments) || payment.attachments;
          payment.pay_reason = req["body"].pay_reason || payment.pay_reason;
          payment.pay_reason_id =
            req["body"].pay_reason_id || payment.pay_reason_id;
          payment.remark = req["body"].remark || payment.remark;
          payment.trace = req["body"].trace || payment.trace;
          payment.approve_status =
            req["body"].approve_status || payment.approve_status;

          await payment
            .save()
            .then(async (paymentU) => {
              if (paymentU !== null) {
                res.status(200).json(paymentU);
              } else {
                res.status(404).json({});
              }
            })
            .catch((error) => {
              console.error(chalk.red(error.toString()));
              res.status(400).json({ error: error.toString() });
            });
        } else {
          res.status(404).json({});
        }
      })
      .catch((error) => {
        console.error(chalk.red(error.toString()));
        res.status(500).json({ error: error.toString() });
      });
  } catch (error) {
    console.error(chalk.red(error.toString()));
    res.status(500).json({ error: error.toString() });
  }
});

//Delete Tournament Event
const deleteTPayment = asyncHandler(async (req, res) => {
  try {
    await Payment.findById(req["query"].id)
      .then(async (filterPayment) => {
        if (filterPayment) {
          await Payment.deleteOne({ _id: req["query"].id })
            .then(async () => {
              await Payment.find({}).then((filterPayments) => {
                res.status(200).json({ payments: filterPayments });
              });
            })
            .catch((error) => {
              console.error(chalk.red(error.toString()));
              res.status(500).json({ error: error.toString() });
            });
        } else {
          res.status(404).json({});
        }
      })
      .catch((error) => {
        console.error(chalk.red(error.toString()));
        res.status(500).json({ error: error.toString() });
      });
  } catch (error) {
    console.error(chalk.red(error.toString()));
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = {
  addTPayment,
  getAllTPayments,
  updateTPayment,
  deleteTPayment,
};
