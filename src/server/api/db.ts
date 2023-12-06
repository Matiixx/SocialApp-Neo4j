import neo4j from "neo4j-driver";
import { env } from "~/env";

const driver = neo4j.driver(
  env.NEO4J_URI,
  neo4j.auth.basic(env.NEO4J_USERNAME, env.NEO4J_PASSWORD),
);

export default driver;