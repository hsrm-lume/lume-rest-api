import { auth, driver } from 'neo4j-driver';
import config from '../config/config';

/**
 * Can be used to delay further execution
 * @param ms Time to sleep for in ms
 * @returns a Promise that resolves after the given time
 */
function sleep(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

// initializes the driver with config
const neo4j = driver(
	config.neo4j.url,
	auth.basic(config.neo4j.user, config.neo4j.password)
);

/**
 * recursive function to test the connection to the neo4j-server
 */
const testConnection = async () => {
	console.log('testing connection...');
	await sleep(3000);
	neo4j
		.verifyConnectivity()
		.then((si) => console.log('connected to', si))
		.catch((err) => {
			testConnection();
		});
};
// starts the recursive connection-test
testConnection();

/**
 * ensures to close the connection to the neo4j-database
 * if a listed process-signal is received
 */
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

// Exports the driver to be used in other modules
export default neo4j;
