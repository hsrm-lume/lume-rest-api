/**
 * Wraps the config in a single object to allow
 * easier access to the config values.
 * Some values are retrieved from the environment and
 * have fallback values if not set in env.
 */
export default {
	apiVersion: '1',
	neo4j: {
		url: process.env.NEO4J_URL || 'neo4j://localhost:7687',
		user: process.env.NEO4J_USER || 'neo4j',
		password: process.env.NEO4J_PASSWORD || 's3cr3t4',
	},
	stage: process.env.NODE_STAGE || 'prod',
	port: 3000,
};
