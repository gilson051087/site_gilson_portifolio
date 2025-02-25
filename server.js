require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch'); // Para fazer a requisição HTTP para o webhook

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
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model('Message', messageSchema);

// Função para enviar WhatsApp - Isso seria feito no front-end
function enviarWhatsApp(nome, email, mensagem) {
    var telefone = "5541999642855"; // Número de telefone do WhatsApp
    var texto = `Olá, meu nome é ${nome}, meu email é ${email} e gostaria de falar sobre: ${mensagem}`;
    var url = `https://wa.me/${telefone}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
}

// Rota de API para salvar mensagem e enviar o webhook
app.post('/api/messages', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Criando e salvando a nova mensagem no banco
        const newMessage = new Message({
            name,
            email,
            message
        });

        await newMessage.save();

        // Enviar dados para o webhook n8n
        const webhookUrl = 'https://gilsonelias.app.n8n.cloud/webhook-test/645dd501-fa73-46bd-8e5d-730d467012c9'; // Minha URL webhook
        const webhookData = { name, email, message };

        // Requisição POST para o webhook
        await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(webhookData)
        });

        // Enviar WhatsApp
        enviarWhatsApp(name, email, message);

        // Resposta de que deu certo
        res.status(201).json({ message: 'Mensagem enviada com sucesso!' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Erro ao enviar mensagem. Tente novamente.' });
    }
});

// Rota de renderização da página HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
