package io.tiler.demo;

import org.simondean.vertx.async.Async;
import org.simondean.vertx.async.AsyncResultHandlerWrapper;
import org.vertx.java.core.Future;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.platform.Verticle;

public class MainVerticle extends Verticle {
  private Logger logger;

  public void start(final Future<Void> startedResult) {
    logger = container.logger();
    JsonObject config = container.config();

    Async.series()
      .task(handler -> container.deployVerticle("io.tiler.ServerVerticle", config.getObject("server"), 1, AsyncResultHandlerWrapper.wrap(handler)))
      .task(handler -> container.deployModule("io.tiler~tiler-collector-example~0.1.1", config.getObject("example"), 1, AsyncResultHandlerWrapper.wrap(handler)))
      .run(result -> {
        if (result.failed()) {
          startedResult.setFailure(result.cause());
          return;
        }

        logger.info("MainVerticle started");
        startedResult.setResult(null);
      });
  }
}
