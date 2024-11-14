const firebaseConfig = {
    apiKey: "AIzaSyC4eYYA10BOlcet8JAFpJtMN2VBhozVddU",
    authDomain: "maslow-needs.firebaseapp.com",
    projectId: "maslow-needs",
    storageBucket: "maslow-needs.firebasestorage.app",
    messagingSenderId: "12410373499",
    appId: "1:12410373499:web:90de6b9517d65b4dfee9de",
    measurementId: "G-MJ6XNGNS30"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', () => {
    let usuarioLogado = null; // Variável para armazenar o usuário autenticado

    const form = document.querySelector('#meuFormulario');
    
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (event.submitter.id === 'login') { 
            const provider = new firebase.auth.GoogleAuthProvider();

            auth.signInWithPopup(provider)
                .then((result) => {
                    // O usuário está autenticado
                    usuarioLogado = result.user;
                    alert('Login realizado com sucesso');
                    console.log('Usuário autenticado:', usuarioLogado.displayName, usuarioLogado.email);
                })
                .catch((error) => {
                    console.error('Erro ao fazer login:', error);
                });
        }
        
        if (event.submitter.id === 'send') {   
            if (!usuarioLogado) {
                alert('Você precisa estar logado para enviar o questionário.');
                return;
            }

            // Captura todas as questões e respostas
            const respostas = [];
            const perguntas = form.querySelectorAll('.question');
            
            perguntas.forEach((pergunta, index) => {
                const textoPergunta = pergunta.querySelector('.question-label').innerText;
                const respostaSelecionada = pergunta.querySelector('input[type="radio"]:checked');

                if (respostaSelecionada) {
                    respostas.push({
                        pergunta: `Questão ${index + 1}: ${textoPergunta}`,
                        resposta: respostaSelecionada.value
                    });
                }
            });

            if (respostas.length > 0) {
                // Envia as respostas para o Firestore com o nome e o email do usuário
                db.collection('needs').add({
                    nome: usuarioLogado.displayName,
                    email: usuarioLogado.email,
                    respostas: respostas
                })
                .then(() => {
                    alert('Dados enviados com sucesso');
                    console.log('Dados:', { nome: usuarioLogado.displayName, email: usuarioLogado.email, respostas });
                })
                .catch((error) => {
                    console.error('Erro ao enviar os dados:', error);
                });
            } else {
                alert('Por favor, responda pelo menos uma questão antes de enviar.');
            }
        }
    });
});