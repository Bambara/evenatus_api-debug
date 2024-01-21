const asyncHandler = require("express-async-handler");
const chalk = require("chalk");
const https = require("node:https");

const sendSMS = asyncHandler(async (req, res) => {
  try {
    const postData = {
      version: process.env.MSPACE_APP_VERSION,
      applicationId: process.env.MSPACE_APP_ID,
      password: process.env.MSPACE_APP_PASS,
      message: req["body"].message,
      destinationAddresses: req["body"].desAddr,
      sourceAddress: process.env.MSPACE_APP_SOURCE,
    };

    const options = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=utf-8",
        "Content-Length": JSON.stringify(postData).length.toString(),
      },
      hostname: "api.mspace.lk",
      path: "/sms/send",
      method: "POST",
    };

    console.info(chalk.blue(JSON.stringify(postData)));

    const smsReq = https.request(options, (smsRes) => {
      console.info(chalk.green(`STATUS: ${smsRes.statusCode}`));
      console.info(chalk.green(`HEADERS: ${JSON.stringify(smsRes.headers)}`));

      smsRes.setEncoding("utf8");
      // smsRes.headers["content-type"] = "application/json;charset=utf-8";

      smsRes.on("data", (body) => {
        console.info(
          chalk.blue(`BODY: ${JSON.stringify(JSON.parse(body), null, 2)}`),
        );
        res.status(200).json(JSON.parse(body));
      });

      smsRes.on("end", () => {
        console.warn(chalk.yellow("No more data in response."));
      });
    });

    smsReq.on("error", (e) => {
      console.error(chalk.red(e.toString()));
      res.status(500).json({ error: e.toString() });
    });

    // write data to request body
    smsReq.write(JSON.stringify(postData));
    smsReq.end();
  } catch (e) {
    console.error(chalk.red(e.toString()));
    res.status(500).json({ error: e.toString() });
  }
});

module.exports = {
  sendSMS,
};
