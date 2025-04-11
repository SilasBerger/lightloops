import app from './app';
import Logger from './utils/logger';

// TODO: Create WS server and have both REST and WS listen on the same port; create WS endpoint.

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    Logger.info(`Application is running at: http://localhost:${PORT}.`);
    Logger.info('Press Ctrl+C to quit.');
});
