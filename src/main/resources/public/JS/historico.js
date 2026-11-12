document.addEventListener("DOMContentLoaded", () => {

    const dataAtualizacao = document.getElementById(
        "dataAtualizacaoHistorico"
    );

    function atualizarDataHistorico() {
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

        if (dataAtualizacao) {
            dataAtualizacao.textContent = `${data}, ${hora}`;
        }
    }

    atualizarDataHistorico();
    setInterval(atualizarDataHistorico, 1000);

    const tabela = document.getElementById("linhasEventos");

    const campoBusca = document.getElementById("campoBusca");
    const filtroPeriodo = document.getElementById("filtroPeriodo");
    const filtroCategoria = document.getElementById("filtroCategoria");
    const filtroStatus = document.getElementById("filtroStatus");
    const filtroDispositivo = document.getElementById("filtroDispositivo");
    const limparFiltros = document.getElementById("limparFiltros");

    let todosRegistros = [];
    let mapaDispositivos = new Map();


function atualizarCards(
    registros,
    dispositivos,
    historicoAtuadores = [],
    historicoDispositivos = []
) {

    const totalEventos = document.getElementById("totalEventos");
    const totalMedicoes = document.getElementById("totalMedicoes");
    const totalDispositivos = document.getElementById("totalDispositivos");
    const totalAtuadores = document.getElementById("totalAtuadores");
    const totalAlertas = document.getElementById("totalAlertas");

    let alertas = 0;

    registros.forEach(registro => {
        const temperatura = Number(registro.temperatura);
        const umidade = Number(registro.umidade);

        if (
            temperatura >= 25 ||
            umidade < 40 ||
            umidade > 60
        ) {
            alertas++;
        }
    });

    // Quantidade de comandos dos atuadores
    const quantidadeComandos = historicoAtuadores.length;

    // Quantidade de cadastros e alterações dos dispositivos
    const quantidadeEventosDispositivos = historicoDispositivos.length;

    // Soma todos os eventos registrados
    const quantidadeTotal =
        registros.length +
        quantidadeComandos +
        quantidadeEventosDispositivos +
        alertas;

    // Atualiza os cards
    totalEventos.textContent = quantidadeTotal;
    totalMedicoes.textContent = registros.length;
    totalDispositivos.textContent = dispositivos.length;
    totalAtuadores.textContent = quantidadeComandos;
    totalAlertas.textContent = alertas;
}


    function converterDataHistorico(valor) {
        if (!valor) return NaN;

        const texto = String(valor).trim();

        // Formato brasileiro: DD/MM/AAAA HH:mm:ss
        const brasileira = texto.match(
            /^(\d{2})\/(\d{2})\/(\d{4})[,\s]+(\d{2}):(\d{2})(?::(\d{2}))?/
        );

        if (brasileira) {
            const [, dia, mes, ano, hora, minuto, segundo = "00"] = brasileira;

            return new Date(
                Number(ano),
                Number(mes) - 1,
                Number(dia),
                Number(hora),
                Number(minuto),
                Number(segundo)
            ).getTime();
        }

        // Formato do MySQL: AAAA-MM-DD HH:mm:ss
        return new Date(texto.replace(" ", "T")).getTime();
    }

    function aplicarFiltros() {
        const busca = (campoBusca?.value || "").toLowerCase().trim();
        const periodo = filtroPeriodo?.value || "";
        const categoria = filtroCategoria?.value || "";
        const statusSelecionado = filtroStatus?.value || "";
        const dispositivoSelecionado = filtroDispositivo?.value || "";

        const periodos = {
            "24h": 86400000,
            "7d": 604800000,
            "30d": 2592000000
        };

        const agora = Date.now();
        const eventos = [];

        console.log("Dispositivos recebidos:", window.eventosDispositivos);

        // 1. Transforma medições em eventos
        todosRegistros.forEach(registro => {
            const dispositivo = mapaDispositivos.get(
                Number(registro.id_dispositivos_fk)
            );

            const temperatura = Number(registro.temperatura);
            const umidade = Number(registro.umidade);

            const status = (
                temperatura >= 25 ||
                umidade < 40 ||
                umidade > 60
            ) ? "Aviso" : "Normal";

            eventos.push({
                data: registro.time_stamp,
                categoria: "Temperatura",
                dispositivoId: String(registro.id_dispositivos_fk),
                nome: dispositivo?.nome_dispositivo ||
                    `Dispositivo ${registro.id_dispositivos_fk}`,
                local: dispositivo?.localizacao || "Local não informado",
                descricao: "Registro de temperatura e umidade",
                valor: `${temperatura} °C | ${umidade} %HR`,
                status: status
            });

// Cria um evento de alerta quando os limites são ultrapassados
if (status === "Aviso") {

    const motivos = [];

    if (temperatura >= 25) {
        motivos.push("Temperatura elevada");
    }

    if (umidade < 40) {
        motivos.push("Umidade baixa");
    } else if (umidade > 60) {
        motivos.push("Umidade elevada");
    }

    eventos.push({
        data: registro.time_stamp,
        categoria: "Alerta",
        dispositivoId: String(registro.id_dispositivos_fk),
        nome: dispositivo?.nome_dispositivo ||
            `Dispositivo ${registro.id_dispositivos_fk}`,
        local: dispositivo?.localizacao || "Local não informado",
        descricao: motivos.join(" e "),
        valor: `${temperatura} °C | ${umidade} %HR`,
        status: "Aviso"
    });
}

        });

        // 2. Transforma comandos dos atuadores em eventos
        (window.eventosAtuadores || []).forEach(atuador => {
            const dispositivo = mapaDispositivos.get(
                Number(atuador.id_dispositivos_fk)
            );

            const ligado = atuador.status_novo === true ||
                           atuador.status_novo === 1;

            eventos.push({
                data: atuador.data_hora,
                categoria: "Atuador",
                dispositivoId: String(atuador.id_dispositivos_fk),
                nome: atuador.nome_atuador,
                local: dispositivo?.localizacao || "Local não informado",
                descricao: ligado ? "Atuador ligado" : "Atuador desligado",
                valor: ligado ? "LIGADO" : "DESLIGADO",
                status: "Normal"
            });
        });


        // 3. Transforma cadastros de dispositivos em eventos
        (window.eventosDispositivos || []).forEach(dispositivo => {

            const dadosDispositivo = mapaDispositivos.get(
                Number(dispositivo.id_dispositivos_fk)
            );

            eventos.push({
                data: dispositivo.data_hora,
                categoria: "Dispositivo",
                dispositivoId: String(dispositivo.id_dispositivos_fk),
                nome: dispositivo.nome_dispositivo,
                local: dadosDispositivo?.localizacao || "Local não informado",
                descricao: dispositivo.descricao ||
                    `Dispositivo: ${dispositivo.acao}`,
                valor: dispositivo.acao,
                status: "Normal"
            });
        });



        // 3. Aplica os mesmos filtros a todos os eventos
        return eventos.filter(evento => {
            if (categoria && evento.categoria !== categoria) {
                return false;
            }

            if (statusSelecionado && evento.status !== statusSelecionado) {
                return false;
            }

            if (
                dispositivoSelecionado &&
                evento.dispositivoId !== dispositivoSelecionado
            ) {
                return false;
            }

            const textoBusca = [
                evento.nome,
                evento.local,
                evento.categoria,
                evento.descricao,
                evento.valor,
                evento.status,
                evento.data
            ].join(" ").toLowerCase();

            if (busca && !textoBusca.includes(busca)) {
                return false;
            }

            if (periodo && periodos[periodo]) {
                const data = converterDataHistorico(evento.data);

                if (
                    !Number.isFinite(data) ||
                    data < agora - periodos[periodo] ||
                    data > agora
                ) {
                    return false;
                }
            }

            return true;
        }).sort((a, b) =>
            converterDataHistorico(b.data) -
            converterDataHistorico(a.data)
        );
    }

    async function carregarHistorico() {

    console.log(
        "Histórico atualizado às:",
        new Date().toLocaleTimeString("pt-BR")
    );
        try {
            // Busca os registros no backend Java
            // Busca os registros e os dispositivos no backend Java
            const [
                respostaRegistros,
                respostaDispositivos,
                respostaAtuadores,
                respostaHistoricoDispositivos
            ] = await Promise.all([
                fetch("/api/registros"),
                fetch("/api/dispositivos"),
                fetch("/api/atuadores/historico"),
                fetch("/api/dispositivos/historico")
            ]);

            if (
                !respostaRegistros.ok ||
                !respostaDispositivos.ok ||
                !respostaAtuadores.ok ||
                !respostaHistoricoDispositivos.ok
            ) {
                throw new Error("Erro ao buscar dados do banco");
            }

// Converte as respostas JSON em objetos JavaScript
            const registros = await respostaRegistros.json();
            const dispositivos = await respostaDispositivos.json();
            const historicoAtuadores = await respostaAtuadores.json();

// Recebe o histórico de dispositivos do MySQL
const historicoDispositivos =
    await respostaHistoricoDispositivos.json();

// Guarda os dados para utilizar na tabela
window.eventosDispositivos = historicoDispositivos;

// Mostra os dados no Console para verificar
console.log("Histórico dos dispositivos:", historicoDispositivos);

            window.eventosAtuadores = historicoAtuadores;

            console.log("Histórico dos atuadores:", historicoAtuadores);

            atualizarCards(
                registros,
                dispositivos,
                historicoAtuadores,
                historicoDispositivos
            );

            const statusDados = document.getElementById("statusDadosHistorico");

            if (statusDados) {
                statusDados.textContent = "DADOS DO BANCO";
            }

// Associa cada ID ao dispositivo correspondente


            dispositivos.forEach(dispositivo => {
                mapaDispositivos.set(
                    Number(dispositivo.id_dispositivos),
                    dispositivo
                );
            });


// Guarda o dispositivo selecionado antes de atualizar
const dispositivoAnterior = filtroDispositivo.value;

// Limpa e recria as opções
filtroDispositivo.innerHTML =
    '<option value="">Todos os dispositivos</option>';

// Adiciona os dispositivos atualizados do banco
dispositivos.forEach(dispositivo => {
    const option = document.createElement("option");

    option.value = String(dispositivo.id_dispositivos);
    option.textContent = dispositivo.nome_dispositivo;

    filtroDispositivo.appendChild(option);
});

// Restaura a seleção anterior, se o dispositivo ainda existir
const dispositivoExiste = Array.from(
    filtroDispositivo.options
).some(option => option.value === dispositivoAnterior);

if (dispositivoExiste) {
    filtroDispositivo.value = dispositivoAnterior;
}


            // Organiza do registro mais recente para o mais antigo
            todosRegistros = registros;

// Organiza do mais recente para o mais antigo
            todosRegistros.sort((a, b) => b.id_registro - a.id_registro);

            // Remove a mensagem "Carregando histórico..."



function formatarDataHora(data) {
    if (!data) return "-";

    const texto = String(data);

    // Aceita datas como 2026-11-12T00:23:53
    // ou 2026-11-12 00:23:53
    const resultado = texto.match(
        /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/
    );

    if (!resultado) return texto.replace("T", " ");

    const [, ano, mes, dia, hora, minuto, segundo = "00"] = resultado;

    return `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;
}


            function atualizarTabela() {
                const eventosFiltrados = aplicarFiltros();

                tabela.innerHTML = "";

                if (eventosFiltrados.length === 0) {
                    tabela.innerHTML =
                        '<tr><td colspan="7">Nenhum registro encontrado.</td></tr>';
                    return;
                }

                eventosFiltrados.forEach(evento => {
                    const linha = document.createElement("tr");


let origem = "Sistema";

switch (evento.categoria) {
    case "Temperatura":
        origem = "Sensor";
        break;

    case "Alerta":
        origem = "Monitoramento";
        break;

    case "Atuador":
        origem = "Comando";
        break;

    case "Dispositivo":
        if (evento.valor === "CADASTRO") {
            origem = "Cadastro";
        } else if (evento.valor === "ALTERACAO") {
            origem = "Alteração";
        } else {
            origem = "Dispositivo";
        }
        break;
}

const valores = [
    formatarDataHora(evento.data),
    evento.categoria,
    `${evento.nome} / ${evento.local}`,
    evento.descricao,
    evento.valor,
    evento.status,
    origem
];


                    valores.forEach((valor, indice) => {
                        const celula = document.createElement("td");

                        if (indice === 5) {
                            const indicador = document.createElement("span");

                            indicador.className =
                                `status_evento ${evento.status.toLowerCase()}`;

                            indicador.textContent = evento.status;
                            celula.appendChild(indicador);
                        } else {
                            celula.textContent = valor;
                        }

                        linha.appendChild(celula);
                    });

                    tabela.appendChild(linha);
                });
            }// Fecha a função atualizarTabela()

            // Exibe os registros na tabela
            atualizarTabela();


            campoBusca.oninput = atualizarTabela;
            filtroPeriodo.onchange = atualizarTabela;
            filtroCategoria.onchange = atualizarTabela;
            filtroStatus.onchange = atualizarTabela;
            filtroDispositivo.onchange = atualizarTabela;

            // Botão para limpar os filtros
            limparFiltros.onclick = () => {
                campoBusca.value = "";
                filtroPeriodo.value = "";
                filtroCategoria.value = "";
                filtroStatus.value = "";
                filtroDispositivo.value = "";

                atualizarTabela();
            };

        } catch (erro) {
            console.error("Erro ao carregar histórico:", erro);

            const statusDados = document.getElementById("statusDadosHistorico");

            if (statusDados) {
                statusDados.textContent = "ERRO DE CONEXÃO";
            }

            tabela.innerHTML = `
        <tr>
            <td colspan="7">Erro ao carregar histórico.</td>
        </tr>
    `;
        }
    }

// Atualiza automaticamente a cada 10 segundos
// Controla as atualizações do histórico
let atualizandoHistorico = false;

// Carrega os dados imediatamente ao abrir a página
atualizandoHistorico = true;

carregarHistorico().finally(() => {
    atualizandoHistorico = false;
});

// Atualiza automaticamente a cada 10 segundos

setInterval(async () => {
    if (atualizandoHistorico) return;

    atualizandoHistorico = true;

    try {
        await carregarHistorico();
    } finally {
        atualizandoHistorico = false;
    }
}, 10000);

});