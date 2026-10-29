
document.addEventListener("DOMContentLoaded", () => {
    // Elementos dos cards
    const temperaturaCard = document.querySelector(".HT");
    const umidadeCard = document.querySelector(".HU");
    const co2Card = document.querySelector(".HA");
    const dispositivosCard = document.querySelector(".HD");

    const statusTemperatura = document.querySelector(".PT2");
    const statusUmidade = document.querySelector(".PU2");
    const statusCo2 = document.querySelector(".PA2");
    const statusDispositivos = document.querySelector(".PD2");

    const detalheTemperatura = document.querySelector(".temperatura");
    const detalheUmidade = document.querySelector(".humidade");
    const detalheCo2 = document.querySelector(".co2");

    const dataAtualizacao = document.querySelector(
        ".ultima-atualizacao strong"
    );

    const registro = document.querySelector(".registro-atuadores span");

    const botoesPeriodo = document.querySelectorAll(".graf-periodo button");

    // Limites dos sensores
    const limites = {
        temperaturaAviso: 25,
        umidadeMinima: 40,
        umidadeMaxima: 60,
        co2Aviso: 1000,
        co2Critico: 1400
    };

    // Dados iniciais simulados
    const sensores = {
        temperatura: 22.5,
        umidade: 49,
        co2: 1617
    };

    const dispositivos = [
        { nome: "ENV-A01", co2: 900 },
        { nome: "CO2-A02", co2: 1350 },
        { nome: "ENV-B01", co2: 810 },
        { nome: "ENV-BIB", co2: 756 },
        { nome: "NOT-REF", co2: 1044 },
        { nome: "ENV-PAT", co2: 576 },
        { nome: "ENV-GIN", co2: 1617 }
    ];

    // Formata a data de atualização
    function atualizarData() {
        if (!dataAtualizacao) return;

        const agora = new Date();

        const data = agora.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit"
        });

        const hora = agora.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

        dataAtualizacao.textContent = `${data}, ${hora}`;
    }

    // Atualiza o texto e a cor de um estado
    function atualizarStatus(elemento, texto, classe) {
        if (!elemento) return;

        elemento.textContent = `●${texto}`;
        elemento.classList.remove("status-normal", "status-aviso", "status-critico");
        elemento.classList.add(classe);
    }

    function statusTemperaturaAtual(valor) {
        if (valor >= limites.temperaturaAviso) {
            return ["Aviso", "status-aviso"];
        }

        return ["Normal", "status-normal"];
    }

    function statusUmidadeAtual(valor) {
        if (
            valor < limites.umidadeMinima ||
            valor > limites.umidadeMaxima
        ) {
            return ["Aviso", "status-aviso"];
        }

        return ["Normal", "status-normal"];
    }

    function statusCo2Atual(valor) {
        if (valor >= limites.co2Critico) {
            return ["Crítico", "status-critico"];
        }

        if (valor >= limites.co2Aviso) {
            return ["Aviso", "status-aviso"];
        }

        return ["Normal", "status-normal"];
    }

    // Atualiza os valores dos cards
    function atualizarSensores() {
        const tempStatus = statusTemperaturaAtual(sensores.temperatura);
        const umidStatus = statusUmidadeAtual(sensores.umidade);
        const co2Status = statusCo2Atual(sensores.co2);

        if (temperaturaCard) {
            temperaturaCard.textContent =
                `${sensores.temperatura.toFixed(1)}° C`;
        }

        if (umidadeCard) {
            umidadeCard.textContent =
                `${Math.round(sensores.umidade)} %HR`;
        }

        if (co2Card) {
            co2Card.textContent =
                `${Math.round(sensores.co2)} ppm`;
        }

        atualizarStatus(statusTemperatura, ...tempStatus);
        atualizarStatus(statusUmidade, ...umidStatus);
        atualizarStatus(statusCo2, ...co2Status);

        if (detalheTemperatura) {
            detalheTemperatura.textContent =
                `${sensores.temperatura.toFixed(1)} °C`;
        }

        if (detalheUmidade) {
            detalheUmidade.textContent =
                `${Math.round(sensores.umidade)} %RH`;
        }

        if (detalheCo2) {
            detalheCo2.textContent =
                `${Math.round(sensores.co2)} ppm`;
        }

        atualizarData();
    }

    // Atualiza as barras de concentração de CO2
    function atualizarBarrasCo2() {
        document.querySelectorAll(".barra-co2").forEach((barra, indice) => {
            const dispositivo = dispositivos[indice];
            if (!dispositivo) return;

            const valor = barra.querySelector(".co2-valor");
            const trilho = barra.querySelector(".co2-trilho");

            if (!valor || !trilho) return;

            const porcentagem = Math.min(
                (dispositivo.co2 / 1800) * 100,
                100
            );

            valor.style.width = `${porcentagem}%`;

            valor.classList.remove("normal", "aviso", "critico");

            if (dispositivo.co2 >= limites.co2Critico) {
                valor.classList.add("critico");
            } else if (dispositivo.co2 >= limites.co2Aviso) {
                valor.classList.add("aviso");
            } else {
                valor.classList.add("normal");
            }

            trilho.setAttribute(
                "title",
                `${dispositivo.nome}: ${dispositivo.co2} ppm`
            );
        });
    }

    // Simula pequenas variações nos sensores
    function simularSensores() {
        sensores.temperatura = Math.max(
            18,
            Math.min(32, sensores.temperatura + (Math.random() - 0.5) * 1.2)
        );

        sensores.umidade = Math.max(
            25,
            Math.min(75, sensores.umidade + (Math.random() - 0.5) * 4)
        );

        sensores.co2 = Math.max(
            400,
            Math.min(2000, sensores.co2 + (Math.random() - 0.5) * 150)
        );

        dispositivos.forEach((dispositivo) => {
            dispositivo.co2 = Math.max(
                350,
                Math.min(
                    2000,
                    dispositivo.co2 + (Math.random() - 0.5) * 120
                )
            );
        });

        atualizarSensores();
        atualizarBarrasCo2();
    }

    // Controle dos atuadores
    const botoesAtuadores = document.querySelectorAll(".botao-atuador");

    botoesAtuadores.forEach((botao) => {
        botao.addEventListener("click", () => {
            const estavaLigado = botao.classList.contains("ligado");
            const novoEstado = estavaLigado ? "desligado" : "ligado";

            botao.classList.remove("ligado", "desligado");
            botao.classList.add(novoEstado);

            botao.innerHTML = `
                <span class="indicador"></span>
                ${novoEstado === "ligado" ? "LIGADO" : "DESLIGADO"}
            `;

            const nomeAtuador =
                botao.closest(".atuador")
                    ?.querySelector(".atuador-info h3")
                    ?.childNodes[0]?.textContent.trim() || "Atuador";

            if (registro) {
                const agora = new Date().toLocaleTimeString("pt-BR");

                registro.textContent =
                    `${agora} — ${nomeAtuador}: ${novoEstado.toUpperCase()}`;

                const historico = document.querySelector(
                    ".registro-atuadores"
                );

                if (historico) {
                    let lista = historico.querySelector(".historico-comandos");

                    if (!lista) {
                        lista = document.createElement("div");
                        lista.className = "historico-comandos";
                        lista.style.cssText =
                            "max-height:70px;overflow-y:auto;";

                        historico.appendChild(lista);
                    }

                    const item = document.createElement("p");
                    item.textContent =
                        `${agora} — ${nomeAtuador}: ${novoEstado.toUpperCase()}`;

                    lista.prepend(item);
                }
            }
        });
    });

    // Seleção do período do gráfico
    botoesPeriodo.forEach((botao) => {
        botao.addEventListener("click", () => {
            botoesPeriodo.forEach((item) => {
                item.classList.remove("ativo");
            });

            botao.classList.add("ativo");

            const periodo = botao.textContent.trim();

            const grafico = document.querySelector(".graf-conteudo");

            if (grafico) {
                grafico.dataset.periodo = periodo;
            }
        });
    });

    // Inicialização
    atualizarSensores();
    atualizarBarrasCo2();

    // Atualização simulada a cada 5 segundos
    setInterval(simularSensores, 5000);
});


/* ========================================
   MENU LATERAL - ATMOSFERA 4.0
======================================== */

const botaoMenu = document.getElementById("botaoMenu");
const menuLateral = document.getElementById("menuLateral");
const menuFundo = document.getElementById("menuFundo");
const fecharMenu = document.getElementById("fecharMenu");

function abrirMenu() {
    menuLateral.classList.add("aberto");
    menuFundo.classList.add("aberto");

    botaoMenu.setAttribute("aria-expanded", "true");
    menuLateral.setAttribute("aria-hidden", "false");
}

function fecharMenuLateral() {
    menuLateral.classList.remove("aberto");
    menuFundo.classList.remove("aberto");

    botaoMenu.setAttribute("aria-expanded", "false");
    menuLateral.setAttribute("aria-hidden", "true");
}

// Abrir ao clicar no botão do cabeçalho
botaoMenu.addEventListener("click", abrirMenu);

// Fechar pelo botão X
fecharMenu.addEventListener("click", fecharMenuLateral);

// Fechar ao clicar no fundo escurecido
menuFundo.addEventListener("click", fecharMenuLateral);

// Fechar ao retirar o mouse do menu
menuLateral.addEventListener("mouseleave", fecharMenuLateral);

// Fechar com a tecla Escape
document.addEventListener("keydown", function(evento) {
    if (evento.key === "Escape") {
        fecharMenuLateral();
    }
});

