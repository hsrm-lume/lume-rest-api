import { auth, driver } from 'neo4j-driver';
import config from '../config/config';

const neo4j = driver(
	config.neo4j.url,
	auth.basic(config.neo4j.user, config.neo4j.password)
);
[
	`exit`,
	`SIGINT`,
	`SIGUSR1`,
	`SIGUSR2`,
	`uncaughtException`,
	`SIGTERM`,
].forEach((eventType) => {
	process.on(eventType, () =>
		neo4j
			.close()
			.then(() => console.log('neo4j closed'))
			.finally(() => process.exit(0))
	);
});

export default neo4j;
