document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. DATA NO RODAPÉ ---
    const anoElement = document.getElementById('anoAtual');
    if (anoElement) {
        anoElement.innerText = new Date().getFullYear();
    }

    // --- 2. LÓGICA DO SIMULADOR ---
    const simuladorForm = document.getElementById('simuladorForm');

    window.selecionarBem = function(tipo) {
        const simuladorSection = document.getElementById('simulador');
        simuladorSection.scrollIntoView({ behavior: 'smooth' });
        const selectBox = document.getElementById('tipoBem');
        selectBox.value = tipo;
        setTimeout(() => { document.getElementById('valorCredito').focus(); }, 800);
    }

    window.formatarMoeda = function(elemento) {
        let valor = elemento.value.replace(/\D/g, "");
        if (valor === "") { elemento.value = ""; return; }
        valor = (parseFloat(valor) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        elemento.value = valor;
    }

    if (simuladorForm) {
        simuladorForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let valor = parseFloat(document.getElementById('valorCredito').value.replace(/\D/g, "")) / 100;
            const parcelas = parseInt(document.getElementById('numParcelas').value);
            if (valor && parcelas) {
                const resultado = (valor * 1.21) / parcelas;
                document.getElementById('valorParcela').innerText = resultado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                document.getElementById('resultadoSimulacao').style.display = 'block';
            } else {
                alert("Por favor, preencha todos os campos corretamente.");
            }
        });
    }

    // ==========================================================
    // CARROSSEL INFINITO (VERSÃO OTIMIZADA - SEM TRAVAS)
    // ==========================================================
    const container = document.getElementById('containerParceiros');
    
    if (container) {
        // 1. CLONAR OS CARDS
        const cardsOriginais = Array.from(container.children);
        cardsOriginais.forEach(card => {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            container.appendChild(clone);
        });

        const cardWidth = 325; // Largura do card + gap

        // 2. FUNÇÃO INTELIGENTE DE MOVIMENTO (MANUAL E AUTO)
        window.rolarCarrossel = function(direcao) {
            const cycleWidth = container.scrollWidth / 2; // Ponto exato onde os clones começam
            
            // --- O TRUQUE MÁGICO (Teletransporte Invisível) ---
            
            // 1. Desliga a suavidade temporariamente
            container.style.scrollBehavior = 'auto'; 

            if (direcao === 'direita') {
                // Se estamos na área dos clones (metade final), voltamos para o início original
                // Fazemos isso ANTES de mover, para garantir que temos "pista" para andar
                if (container.scrollLeft >= cycleWidth - 10) { 
                    container.scrollLeft -= cycleWidth;
                }
            } else {
                // Se estamos no começo (0), pulamos lá para a área dos clones
                if (container.scrollLeft <= 10) {
                    container.scrollLeft += cycleWidth;
                }
            }

            // 3. FORÇA O NAVEGADOR A CALCULAR A POSIÇÃO NOVA (Reflow)
            // Essa linha não faz nada visual, mas obriga o navegador a aceitar o teletransporte
            void container.offsetWidth; 

            // 4. RELIGA A SUAVIDADE E MOVE
            container.style.scrollBehavior = 'smooth';
            
            if (direcao === 'direita') {
                container.scrollBy({ left: cardWidth, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            }
        }

        // 3. AUTO-PLAY (Usando a mesma lógica robusta)
        let playInterval = setInterval(() => {
            window.rolarCarrossel('direita');
        }, 3000);

        // Pausa no Hover
        container.addEventListener('mouseenter', () => clearInterval(playInterval));
        container.addEventListener('mouseleave', () => {
            clearInterval(playInterval);
            playInterval = setInterval(() => {
                window.rolarCarrossel('direita');
            }, 3000);
        });

        // 4. MONITORAMENTO DE SCROLL MANUAL (Dedo no celular)
        // Isso garante que se a pessoa arrastar com o dedo, o loop também funcione
        let isScrolling;
        container.addEventListener('scroll', () => {
            window.clearTimeout(isScrolling);
            // Só ajusta depois que a rolagem parar para não brigar com o dedo do usuário
            isScrolling = setTimeout(() => {
                const cycleWidth = container.scrollWidth / 2;
                if (container.scrollLeft >= cycleWidth) {
                    container.style.scrollBehavior = 'auto';
                    container.scrollLeft -= cycleWidth;
                } else if (container.scrollLeft <= 0) {
                    container.style.scrollBehavior = 'auto';
                    container.scrollLeft += cycleWidth;
                }
            }, 60);
        });
    }
    // FECHAR O MENU LATERAL AO CLICAR EM UM LINK
    const menuLinks = document.querySelectorAll('.offcanvas-body .nav-link');
    const menuLateral = document.getElementById('menuLateral');
    
    if (menuLateral) {
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Pega a instância do Bootstrap e esconde
                const bsOffcanvas = bootstrap.Offcanvas.getInstance(menuLateral);
                if (bsOffcanvas) {
                    bsOffcanvas.hide();
                }
            });
        });
    }
});