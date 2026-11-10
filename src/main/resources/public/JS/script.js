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

    let sensores = {};
    let dispositivos = [];
    let registros = [];
    let atuadores = [];

    const totalSensores = document.getElementById("totalSensores");
    const dispositivosOnline = document.getElementById("dispositivosOnline");
    const ambienteSistema = document.getElementById("ambienteSistema");
    const statusRodape = document.getElementById("statusRodape");

    // Tabela que receberá os registros do banco
    const tabelaRegistros = document.getElementById("tabelaRegistros");

    // Busca os registros no backend
    async function atualizarRodape() {
        try {
            const resposta = await fetch("/api/dispositivos");

            if (!resposta.ok) {
                throw new Error("Erro ao buscar dispositivos");
            }

            dispositivos = await resposta.json();

            const total = dispositivos.length;

            if (totalSensores) {
                totalSensores.textContent = total;
            }

            if (ambienteSistema) {
                ambienteSistema.textContent = "Banco de dados";
            }

            if (statusRodape) {
                statusRodape.textContent = "Dados do banco de dados";
            }

            if (dispositivosOnline) {
                dispositivosOnline.textContent = `--/${total}`;
            }

            if (dispositivosCard) {
                dispositivosCard.textContent = `--/${total}`;
            }

        } catch (erro) {
            console.error("Erro ao atualizar rodapé:", erro);

            if (ambienteSistema) {
                ambienteSistema.textContent = "Sem conexão";
            }

            if (statusRodape) {
                statusRodape.textContent = "Erro ao conectar ao banco";
            }
        }
    }

    async function carregarRegistros() {
        try {
            const resposta = await fetch("/api/registros");

            if (!resposta.ok) {
                throw new Error("Erro ao buscar os registros");
            }

            registros = await resposta.json();

            if (typeof atualizarGrafico === "function") {
                atualizarGrafico(registros);
            }

            registros.sort((a, b) => b.id_registro - a.id_registro);

            const ultimoRegistro = registros[0];

            if (ultimoRegistro) {
                sensores.temperatura = Number(ultimoRegistro.temperatura);
                sensores.umidade = Number(ultimoRegistro.umidade);

                atualizarSensores();
            }

            // Limpa os dados antigos da tabela
            tabelaRegistros.innerHTML = "";

            // Percorre os registros recebidos do banco
            registros.forEach((registro) => {
                const linha = document.createElement("tr");

                const valores = [
                    registro.id_registro,
                    registro.time_stamp,
                    registro.temperatura + " °C",
                    registro.umidade,
                    registro.pressao,
                    registro.altitude,
                    registro.luminosidade,
                    registro.velocidade_vento,
                    registro.direcao_vento,
                    registro.intensidade_wifi
                ];

                valores.forEach((valor) => {
                    const celula = document.createElement("td");
                    celula.textContent = valor ?? "-";
                    linha.appendChild(celula);
                });

                tabelaRegistros.appendChild(linha);
            });

        } catch (erro) {
            console.error("Erro ao carregar registros:", erro);

            tabelaRegistros.innerHTML = `
                <tr>
                    <td colspan="10">Erro ao carregar os dados.</td>
                </tr>
            `;
        }
    }

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

    atualizarData();
    setInterval(atualizarData, 1000);

    // Atualiza o texto e a cor de um estado
    function atualizarStatus(elemento, texto, classe) {
        if (!elemento) return;

        elemento.textContent = `●${texto}`;
        elemento.classList.remove(
            "status-normal",
            "status-aviso",
            "status-critico"
        );
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

        // Cards superiores
        if (temperaturaCard) {
            temperaturaCard.textContent = `${sensores.temperatura.toFixed(1)}° C`;
        }

        if (umidadeCard) {
            umidadeCard.textContent = `${Math.round(sensores.umidade)} %HR`;
        }

        // Status dos cards
        atualizarStatus(statusTemperatura, ...tempStatus);
        atualizarStatus(statusUmidade, ...umidStatus);

        // Detalhes dos sensores
        if (detalheTemperatura) {
            detalheTemperatura.textContent =
                `${sensores.temperatura.toFixed(1)} °C`;
        }

        if (detalheUmidade) {
            detalheUmidade.textContent =
                `${Math.round(sensores.umidade)} %HR`;
        }
    }

    function obterDadosGrafico() {

        // Organiza os registros do mais antigo para o mais recente
        const dadosOrdenados = [...registros].sort(
            (a, b) => a.id_registro - b.id_registro
        );

        // Pega os últimos 7 registros
        const ultimosRegistros = dadosOrdenados.slice(-7);

        const horarios = ultimosRegistros.map(registro => {
            const data = registro.data_hora;

            if (!data) return registro.time_stamp ?? "-";

            return String(data).substring(11, 16);
        });

        const temperaturas = ultimosRegistros.map(
            registro => Number(registro.temperatura)
        );

        const umidades = ultimosRegistros.map(
            registro => Number(registro.umidade)
        );

        return {
            horarios,
            temperaturas,
            umidades
        };
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
    carregarRegistros();
    atualizarRodape();

    // Atualiza os dados do painel a cada 60 segundos.
    setInterval(carregarRegistros, 60000);
    setInterval(atualizarRodape, 60000);
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


/* ========================================
   GRÁFICO DE TEMPERATURA E UMIDADE
   CHART.JS
======================================== */

document.addEventListener("DOMContentLoaded", function () {

    const elementoGrafico = document.getElementById(
        "graficoTemperaturaUmidade"
    );

    if (!elementoGrafico) {
        console.error("Elemento do gráfico não encontrado.");
        return;
    }

    if (typeof Chart === "undefined") {
        console.error(
            "Chart.js não foi carregado. Verifique a biblioteca no HTML."
        );
        return;
    }

    const contexto = elementoGrafico.getContext("2d");

    const dadosGrafico = {
        labels: [],
        temperatura: [],
        umidade: []
    };

    // Gradiente da temperatura
    const gradienteTemperatura = contexto.createLinearGradient(
        0, 0, 0, 180
    );

    gradienteTemperatura.addColorStop(
        0,
        "rgba(43, 125, 248, 0.75)"
    );

    gradienteTemperatura.addColorStop(
        1,
        "rgba(75, 169, 245, 0.34)"
    );

    // Gradiente da umidade
    const gradienteUmidade = contexto.createLinearGradient(
        0, 0, 0, 180
    );

    gradienteUmidade.addColorStop(
        0,
        "rgb(241, 244, 247)"
    );

    gradienteUmidade.addColorStop(
        1,
        "rgba(255, 255, 255, 0.23)"
    );

    // Criação do gráfico
    const grafico = new Chart(contexto, {
        type: "line",

        data: {
            labels: dadosGrafico.labels,

            datasets: [
                {
                    label: "Temperatura (°C)",

                    data: dadosGrafico.temperatura,

                    borderColor: "#1f62f1",
                    backgroundColor: gradienteTemperatura,

                    borderWidth: 2,
                    pointRadius: 3,
                    pointHoverRadius: 5,

                    pointBackgroundColor: "#579aff",
                    pointBorderColor: "#ffffff",

                    fill: true,
                    tension: 0.4,

                    yAxisID: "eixoTemperatura"
                },

                {
                    label: "Umidade (%)",

                    data: dadosGrafico.umidade,

                    borderColor: "#ffffff",
                    backgroundColor: gradienteUmidade,

                    borderWidth: 2,
                    pointRadius: 3,
                    pointHoverRadius: 5,

                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#b4b3b3",

                    fill: true,
                    tension: 0.4,

                    yAxisID: "eixoUmidade"
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            interaction: {
                mode: "index",
                intersect: false
            },

            plugins: {
                legend: {
                    display: false
                },

                tooltip: {
                    backgroundColor: "#202329",
                    titleColor: "#ffffff",
                    bodyColor: "#e0e0e0",

                    borderColor: "#383c44",
                    borderWidth: 1,

                    padding: 10,

                    displayColors: true
                }
            },

            scales: {
                x: {
                    grid: {
                        display: false
                    },

                    border: {
                        display: false
                    },

                    ticks: {
                        color: "#9298a3",
                        font: {
                            size: 10
                        },

                        maxRotation: 0,
                        autoSkip: true
                    }
                },

                eixoTemperatura: {
                    type: "linear",
                    position: "left",

                    min: 10,
                    max: 35,

                    grid: {
                        color: "rgba(255, 255, 255, 0.06)"
                    },

                    border: {
                        display: false
                    },

                    ticks: {
                        color: "#ffffff",
                        font: {
                            size: 10
                        },

                        callback: function (valor) {
                            return valor + "°";
                        }
                    }
                },

                eixoUmidade: {
                    type: "linear",
                    position: "right",

                    min: 0,
                    max: 100,

                    grid: {
                        drawOnChartArea: false
                    },

                    border: {
                        display: false
                    },

                    ticks: {
                        color: "#ffffff",
                        font: {
                            size: 10
                        },

                        callback: function (valor) {
                            return valor + "%";
                        }
                    }
                }
            }
        }
    });

    // Atualiza o gráfico com os registros recebidos do banco
    window.atualizarGrafico = function (registros) {

        if (!Array.isArray(registros)) return;

        // Organiza os registros do mais antigo para o mais recente
        const dadosOrdenados = [...registros].sort(
            (a, b) => a.id_registro - b.id_registro
        );

        // Pega os últimos 7 registros
        const ultimosRegistros = dadosOrdenados.slice(-7);

        // Horários
        grafico.data.labels = ultimosRegistros.map(registro => {
            if (!registro.data_hora) {
                return registro.time_stamp ?? "-";
            }

            return String(registro.data_hora).substring(11, 16);
        });

        // Temperaturas
        grafico.data.datasets[0].data = ultimosRegistros.map(
            registro => Number(registro.temperatura)
        );

        // Umidades
        grafico.data.datasets[1].data = ultimosRegistros.map(
            registro => Number(registro.umidade)
        );

        // Redesenha o gráfico
        grafico.update();
    };

});
/* ========================================
   GRÁFICO DE COLUNAS
======================================== */

const elementoColunas = document.getElementById("graficoColunas");

if (elementoColunas) {

    const contextoColunas = elementoColunas.getContext("2d");

    new Chart(contextoColunas, {

        type: "bar",

        data: {

            labels: [
                "Janeiro",
                "Fevereiro",
                "Março",
                "Abril",
                "Maio",
                "Junho",
                "Julho",
                "Agosto",
                "Setembro",
                "Outubro",
                "Novembro",
                "Decembro"
            ],

            datasets: [
                {
                    label: "Temperatura",

                    data: [
                        28,
                        26,
                        26.5,
                        24.4,
                        22.2,
                        25.3,
                        20.4,
                        22.5,
                        21.3,
                        24.5,
                        24.3,
                        26.7
                    ],

                    backgroundColor: "#48f0a2ab",

                    borderRadius: 2,

                    borderSkipped: false,

                    barPercentage: 0.55,

                    categoryPercentage: 0.75
                }
            ]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: false
                },

                tooltip: {
                    backgroundColor: "rgb(255, 255, 255)",

                    titleColor: "#388329",

                    bodyColor: "#000000",

                    callbacks: {
                        label: function(context) {
                            return context.parsed.y +
                                "Temperatura";
                        }
                    }
                }
            },

            scales: {

                x: {

                    grid: {
                        display: false
                    },

                    ticks: {
                        color: "#ffffff",

                        font: {
                            size: 11
                        }
                    },

                    border: {
                        color: "rgba(255, 255, 255, 0.87)"
                    }
                },

                y: {

                    beginAtZero: true,

                    min: 0,

                    max: 30,

                    title: {
                        display: true,

                        text: "Temperatura",

                        color: "#ffffff",

                        font: {
                            size: 12
                        }
                    },

                    ticks: {
                        stepSize: 5,

                        color: "#ffffff",

                        font: {
                            size: 11
                        }
                    },

                    grid: {
                        color: "rgba(255,255,255,0.18)"
                    },

                    border: {
                        color: "rgba(255,255,255,0.3)"
                    }
                }
            }
        }
    });
}
// ------------Grafico BOla -----------------

const ctx = document.getElementById('graficoRosca');

new Chart(ctx, {
    type: 'doughnut',

    data: {
        labels: ['Dispositivo 1', 'Dispositivo 2', 'Dispositivo 3'],

        datasets: [{
            label: 'My First Dataset',

            data: [300, 50, 100],

            backgroundColor: [
                '#80fcc2',
                '#78b9f5',
                '#ffffffda'
            ],

            borderColor: '#69f8e533',
            borderWidth: 2,

            hoverOffset: 4
        }]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,

        cutout: '48%',

        plugins: {
            legend: {
                display: true,
                position: 'top',

                labels: {
                    usePointStyle: false,
                    boxWidth: 30,
                    boxHeight: 10,
                    padding: 10,

                    font: {
                        size: 11
                    }
                }
            },

            tooltip: {
                enabled: true
            }
        }
    }
});