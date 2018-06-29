const app = require('./src/app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Express app for countries is listening on port ' + port);
});
