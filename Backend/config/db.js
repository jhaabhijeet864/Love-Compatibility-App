const mongoose = require('mongoose');

// Fix the connection string format - remove angle brackets
const connectionString = 'mongodb+srv://jhaabhijeet864:SrrZJJAJWgDIp0Ll@cluster0.mongodb.net/lovePredictor?retryWrites=true&w=majority';

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas', err));

module.exports = mongoose;