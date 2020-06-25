const cors = require("micro-cors")();

export default cors((req, res) => {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Only the POST method is allowed" });
    return;
  }

  if (
    req.body == null ||
    req.body.emails == null ||
    !Array.isArray(req.body.emails)
  ) {
    res.status(422).json({ error: "Invalid request body" });
    return;
  }

  const failed = [];

  for (const address of req.body.emails) {
    if (typeof address !== "string" || !emailPattern.test(address)) {
      res.status(422).json({ error: "Invalid email", email: address });
      return;
    }

    if (Math.random() > 0.95) {
      failed.push(address);
    }
  }

  if (failed.length > 0) {
    res.status(500).json({
      error: "Failed to send emails to some addresses",
      emails: failed
    });

    return;
  }

  res.end();
});

const emailPattern = /.+\@.+\..+/;
