const express = require('express')
const router = express.Router()
const app = express()

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.get('/rota1', (req, res) => {
    res.send('Mensagem para a rota 1');
});
router.get('/rota2', (req, res) => {
    res.send('Mensagem para a rota 2');
});

app.use(router)

const PORT = 3333
app.listen(PORT, () => console.log('Server is running on PORT ', PORT))