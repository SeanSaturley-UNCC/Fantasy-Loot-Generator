const express = require('express');
const app = express();
const PORT = 5000;

app.get('/generate-item', (req,res) => {
    res.send({ message: "Backend test"});
});

app.listen(PORT, () => console.log('Server running on port ${PORT}'));
