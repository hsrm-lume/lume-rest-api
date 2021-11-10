export default {
	apiVersion: '1',
	neo4j: {
		url: process.env.NEO4J_URL || 'neo4j://localhost:7687',
		user: process.env.NEO4J_USER || 'neo4j',
		password: process.env.NEO4J_PASSWORD || 's3cr3t4',
	},
	stage: process.env.NODE_STAGE || 'prod',
	port: Number(process.env.PORT) || 3000,
};
