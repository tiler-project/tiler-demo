package io.tiler.demo;

import org.simondean.vertx.async.Async;
import org.simondean.vertx.async.AsyncResultHandlerWrapper;
import org.vertx.java.core.Future;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.platform.Verticle;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;

public class MainVerticle extends Verticle {
  private Logger logger;
  private Map<String, String> env;
  private JsonObject config;

  public void start(final Future<Void> startedResult) {
    logger = container.logger();
    env = container.env();
    config = container.config();

    mergeConfigWithEnvironmentVariables();

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

  private void mergeConfigWithEnvironmentVariables() {
    mergeServerConfigWithEnvironmentVariables();
  }

  private void mergeServerConfigWithEnvironmentVariables() {
    JsonObject server = config.getObject("server");

    if (server == null) {
      logger.warn("'server' is missing from the config");
      return;
    }

    String portString = getEnvironmentVariable("PORT");

    if (portString != null) {
      logger.info("Setting server port to " + portString);

      try {
        server.putNumber("port", Integer.parseInt(portString));
      } catch (NumberFormatException e) {
        logger.error("Error parsing server port", e);
      }
    }

    JsonObject redis = server.getObject("redis");

    if (redis == null) {
      logger.warn("'redis' is missing from the config");
      return;
    }

    String redisURLString = getEnvironmentVariable("REDISTOGO_URL");

    if (redisURLString != null) {
      logger.info("Setting config to Redis server " + redisURLString);

      try {
        URI redisURL = new URI(redisURLString);
        redis.putString("host", redisURL.getHost());
        redis.putNumber("port", redisURL.getPort());
      } catch (URISyntaxException e) {
        logger.error("Error parsing Redis URL", e);
      }
    }
  }

  private String getEnvironmentVariable(String name) {
    String value = env.get(name);

    if (value == null) {
      logger.warn("Environment variable '" + name + "' has not been set");
    }

    return value;
  }
}
