require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// Conexão MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Schema de Mensagem
const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


document.addEventListener('DOMContentLoaded', function(){
    function enviarWhatsApp() {
        var nome = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var mensagem = document.getElementById('message').value;
    
        if (!nome || !email || !mensagem) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
    
        var telefone = "5541999642855";
        var texto = `Olá, meu nome é ${nome}, meu email é ${email} e gostaria de falar sobre: ${mensagem}`;
    
        var url = `https://wa.me/${telefone}?text=${encodeURIComponent(texto)}`;
        window.open(url, '_blank');
    }
})

const Message = mongoose.model('Message', messageSchema);

// Rotas mensageria

app.post('/api/messages', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newMessage = new Message({
            name,
            email,
            message
        });
        await newMessage.save();
        res.status(201).json({ message: 'Mensagem enviada com sucesso!' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Erro ao enviar mensagem. Tente novamente.' });
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
