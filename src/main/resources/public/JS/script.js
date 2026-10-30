
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
            const resposta = await fetch("http://localhost:8080/api/dispositivos");

            if (!resposta.ok) {
                throw new Error("Erro ao buscar dispositivos");
            }

            dispositivos = await resposta.json();

            // Total de dispositivos cadastrados
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

            // O total de dispositivos online será calculado
            // quando confirmarmos o campo de status da API.
            if (dispositivosOnline) {
                dispositivosOnline.textContent = `--/${total}`;
            }

            // Atualiza o card superior
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
            const resposta = await fetch("http://localhost:8080/api/registros");

            if (!resposta.ok) {
                throw new Error("Erro ao buscar os registros");
            }

            registros = await resposta.json();

            if (typeof atualizarGrafico === "function") {
                atualizarGrafico(registros);
            }

            registros.sort((a, b) => b.id_registro - a.id_registro);

            // Pega o registro mais recente do banco
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
            detalheTemperatura.textContent = `${sensores.temperatura.toFixed(1)} °C`;
        }

        if (detalheUmidade) {
            detalheUmidade.textContent = `${Math.round(sensores.umidade)} %HR`;
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
    carregarRegistros();
    atualizarRodape();

    // Atualizar os registros a cada 1 hr
    setInterval(carregarRegistros, 3600000);
    setInterval(atualizarRodape, 3600000);
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

    // Dados demonstrativos para cada período.
    // Substitua pelos dados reais dos sensores quando disponíveis.
    const dadosGrafico = {
        labels: [],
        temperatura: [],
        umidade: []
    };

    // Gradientes das linhas.
    const gradienteTemperatura = contexto.createLinearGradient(
        0, 0, 0, 180
    );

    gradienteTemperatura.addColorStop(
        0,
        "rgba(245, 160, 75, 0.25)"
    );

    gradienteTemperatura.addColorStop(
        1,
        "rgba(245, 160, 75, 0)"
    );

    const gradienteUmidade = contexto.createLinearGradient(
        0, 0, 0, 180
    );

    gradienteUmidade.addColorStop(
        0,
        "rgba(104, 169, 245, 0.20)"
    );

    gradienteUmidade.addColorStop(
        1,
        "rgba(104, 169, 245, 0)"
    );

    // Criação do gráfico.
    const grafico = new Chart(contexto, {
        type: "line",

        data: {
            labels: dadosGrafico.labels,

            datasets: [
                {
                    label: "Temperatura (°C)",

                    data: dadosGrafico.temperatura,

                    borderColor: "#f5a04b",
                    backgroundColor: gradienteTemperatura,

                    borderWidth: 2,
                    pointRadius: 3,
                    pointHoverRadius: 5,

                    pointBackgroundColor: "#f5a04b",
                    pointBorderColor: "#1b1d21",

                    fill: true,
                    tension: 0.4,

                    yAxisID: "eixoTemperatura"
                },

                {
                    label: "Umidade (%)",

                    data: dadosGrafico.umidade,

                    borderColor: "#68a9f5",
                    backgroundColor: gradienteUmidade,

                    borderWidth: 2,
                    pointRadius: 3,
                    pointHoverRadius: 5,

                    pointBackgroundColor: "#68a9f5",
                    pointBorderColor: "#1b1d21",

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
                        color: "#f5a04b",
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
                        color: "#68a9f5",
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

