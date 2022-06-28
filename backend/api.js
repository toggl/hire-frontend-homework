const fastify = require("fastify");
const cors = require("@fastify/cors");
const static = require("@fastify/static");
const path = require("path");
const send = require("./send");

const app = fastify({ logger: true });

app.get("/health", async (request, reply) => {
  reply.send({ status: "ok" });
});

app.register(send);
app.register(cors);
app.register(static, { root: path.join(__dirname, "static") });

async function start(port) {
  try {
    await app.listen({ port });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start(process.env.PORT || 3000);
