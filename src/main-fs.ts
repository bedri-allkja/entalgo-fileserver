import { App } from "./app";

const app = new App();
let port: number = app.env.config.defaultPort;
if (process.argv.length > 2) {
  port = parseInt(process.argv[2]);
}

app.express.listen(port, () => {
  app.env.logger.info("### Server started on port", port.toString(), " ###");
});

process.on("beforeExit", () => {
  app.env.ynDbConnection.close();
});
