require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
const nodemailer = require('nodemailer'); // Para enviar e-mails

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// Conexão MongoDB
mongoose.connect(process.env.MONGODB_URI || 'criando o banco de dados', {
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

// Função para gerar template HTML
function generateHtmlTemplate(name, email, message) {
    return `
        <h1>Nova Mensagem Recebida</h1>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensagem:</strong> ${message}</p>
    `;
}

// Função para enviar e-mail
async function sendEmail(name, email, message) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'destinatario@example.com', // Substitua pelo e-mail do destinatário
        subject: 'Nova Mensagem Recebida',
        html: generateHtmlTemplate(name, email, message)
    };

    await transporter.sendMail(mailOptions);
}

// Rota de API para salvar mensagem, enviar o webhook e enviar e-mail
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
        const webhookUrl = 'https://gilsonelias.app.n8n.cloud/webhook/645dd501-fa73-46bd-8e5d-730d467012c9'; // Minha URL webhook
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

        // Enviar e-mail
        await sendEmail(name, email, message);

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
