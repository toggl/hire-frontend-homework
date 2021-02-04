const cors = require("micro-cors")();
const sleep = require("then-sleep");

export default cors(async (req, res) => {
  await sleep(300 + Math.random() * 200);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (Math.random() > 0.95) {
    res.status(500).json({ error: "server_error" });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "invalid_http_method" });
    return;
  }

  if (
    req.body == null ||
    req.body.emails == null ||
    !Array.isArray(req.body.emails)
  ) {
    res.status(422).json({ error: "invalid_request_body" });
    return;
  }

  const failed = [];

  for (const address of req.body.emails) {
    if (typeof address !== "string" || !emailPattern.test(address)) {
      res.status(422).json({ error: "invalid_email_address", email: address });
      return;
    }

    if (Math.random() > 0.95) {
      failed.push(address);
    }
  }

  if (failed.length > 0) {
    res.status(500).json({
      error: "send_failure",
      emails: failed
    });

    return;
  }

  res.end();
});

const emailPattern = /.+\@.+\..+/;
