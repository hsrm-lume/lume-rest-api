import 'reflect-metadata';
import App from './app';
import config from './config/config';

const app = new App();
app.initialize();

/**
 * main-kinda function to start the server
 * enables listen mode for the server
 */
app.defaultApp.listen(config.port, () => {
	if (config.stage != 'prod') console.log('CURRENT STAGE: ' + config.stage);
	console.log('Express server listening on port ' + config.port);
});
