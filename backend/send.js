const sleep = require("then-sleep");
const emailPattern = /.+\@.+\..+/;

module.exports = async function send(fastify) {
  fastify.post("/api/send", async (req, res) => {
    await sleep(300 + Math.random() * 200);

    if (Math.random() > 0.95) {
      res.code(500).send({ error: "server_error" });
      return;
    }

    if (
      req.body == null ||
      req.body.emails == null ||
      !Array.isArray(req.body.emails)
    ) {
      res.code(422).send({ error: "invalid_request_body" });
      return;
    }

    const invalid = [];
    const failed = [];

    for (const address of req.body.emails) {
      if (typeof address !== "string" || !emailPattern.test(address)) {
        invalid.push(address);
        continue;
      }

      if (Math.random() > 0.95) {
        failed.push(address);
      }
    }

    if (invalid.length > 0) {
      res.code(422).send({
        error: "invalid_email_address",
        emails: invalid,
      });

      return;
    }

    if (failed.length > 0) {
      res.code(500).send({
        error: "send_failure",
        emails: failed,
      });

      return;
    }

    res.send();
  });
};
