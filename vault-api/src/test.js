import express from 'express'

const app = express();

app.get('/', (req, res) => res.send('Hello'));

app.listen(5000, () => {
  console.log('Test server running');
  console.log('Routes:', app._router?.stack?.length || 'No routes');
});