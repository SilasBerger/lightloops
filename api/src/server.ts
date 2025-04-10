import app from './app';

// TODO: Create WS server and have both REST and WS listen on the same port; create WS endpoint.

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    // TODO: Copy logger from teaching-api and use it here.
    console.log(`Application is running at: http://localhost:${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
