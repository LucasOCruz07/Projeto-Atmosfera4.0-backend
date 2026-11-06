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

    function atualizarCards(registros, dispositivos) {

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

        totalEventos.textContent = registros.length;
        totalMedicoes.textContent = registros.length;
        totalDispositivos.textContent = dispositivos.length;
        totalAtuadores.textContent = "0";
        totalAlertas.textContent = alertas;
    }

    function aplicarFiltros() {
        const busca = (campoBusca?.value || "").toLowerCase().trim();
        const periodo = filtroPeriodo?.value || "";
        const categoria = filtroCategoria?.value || "";
        const statusSelecionado = filtroStatus?.value || "";
        const dispositivoSelecionado = filtroDispositivo?.value || "";

        const agora = Date.now();

        const periodos = {
            "24h": 24 * 60 * 60 * 1000,
            "7d": 7 * 24 * 60 * 60 * 1000,
            "30d": 30 * 24 * 60 * 60 * 1000
        };

        const registrosFiltrados = todosRegistros.filter(registro => {
            const dispositivo = mapaDispositivos.get(
                Number(registro.id_dispositivos_fk)
            );

            const nome = dispositivo?.nome_dispositivo ||
                `Dispositivo ${registro.id_dispositivos_fk}`;

            const local = dispositivo?.localizacao || "";

            const temperatura = Number(registro.temperatura);
            const umidade = Number(registro.umidade);

            const status = temperatura >= 25 ||
            umidade < 40 ||
            umidade > 60
                ? "Aviso"
                : "Normal";

            const textoBusca = `${nome} ${local} ${registro.time_stamp || ""} ${temperatura} ${umidade}`.toLowerCase();

            if (busca && !textoBusca.includes(busca)) {
                return false;
            }

            if (periodo && periodos[periodo]) {
                const dataRegistro = new Date(
                    String(registro.time_stamp).replace(" ", "T")
                );

                if (
                    !Number.isFinite(dataRegistro.getTime()) ||
                    dataRegistro.getTime() < agora - periodos[periodo] ||
                    dataRegistro.getTime() > agora
                ) {
                    return false;
                }
            }

            // Nesta etapa, a tabela contém apenas eventos de medição.
            if (categoria && categoria !== "Temperatura") {
                return false;
            }

            if (statusSelecionado && status !== statusSelecionado) {
                return false;
            }

            if (
                dispositivoSelecionado &&
                String(registro.id_dispositivos_fk) !== dispositivoSelecionado
            ) {
                return false;
            }

            return true;
        });

        return registrosFiltrados;
    }

    async function carregarHistorico() {
        try {
            // Busca os registros no backend Java
            // Busca os registros e os dispositivos no backend Java
            const [respostaRegistros, respostaDispositivos] = await Promise.all([
                fetch("/api/registros"),
                fetch("/api/dispositivos")
            ]);

            if (!respostaRegistros.ok || !respostaDispositivos.ok) {
                throw new Error("Erro ao buscar dados do banco");
            }

// Converte as respostas JSON em objetos JavaScript
            const registros = await respostaRegistros.json();
            const dispositivos = await respostaDispositivos.json();

            atualizarCards(registros, dispositivos);

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

            filtroDispositivo.innerHTML =
                '<option value="">Todos os dispositivos</option>';

            dispositivos.forEach(dispositivo => {
                const option = document.createElement("option");

                option.value = String(dispositivo.id_dispositivos);
                option.textContent = dispositivo.nome_dispositivo;

                filtroDispositivo.appendChild(option);
            });

            // Organiza do registro mais recente para o mais antigo
            todosRegistros = registros;

// Organiza do mais recente para o mais antigo
            todosRegistros.sort((a, b) => b.id_registro - a.id_registro);

            // Remove a mensagem "Carregando histórico..."



            function atualizarTabela() {
                const registrosFiltrados = aplicarFiltros();

            tabela.innerHTML = "";

            // Cria uma linha para cada registro do banco
            registrosFiltrados.forEach(registro => {

                const temperatura = Number(registro.temperatura);
                const umidade = Number(registro.umidade);

                // Verifica os limites dos sensores
                const status = temperatura >= 25 ||
                               umidade < 40 ||
                               umidade > 60
                    ? "Aviso"
                    : "Normal";

                const linha = document.createElement("tr");

                const dispositivo = mapaDispositivos.get(
                    Number(registro.id_dispositivos_fk)
                );

                const nomeDispositivo = dispositivo
                    ? dispositivo.nome_dispositivo
                    : `Dispositivo ${registro.id_dispositivos_fk}`;

                const localizacao = dispositivo?.localizacao || "Local não informado";

                const valores = [
                    registro.time_stamp ?? "-",
                    "Temperatura",
                    `${nomeDispositivo} / ${localizacao}`,
                    "Registro de temperatura e umidade",
                    `${temperatura} °C | ${umidade} %HR`,
                    status,
                    "Sistema"
                ];

                valores.forEach((valor, indice) => {
                    const celula = document.createElement("td");

                    if (indice === 5) {
                        const indicador = document.createElement("span");
                        indicador.className =
                            `status_evento ${status.toLowerCase()}`;
                        indicador.textContent = status;
                        celula.appendChild(indicador);
                    } else {
                        celula.textContent = valor;
                    }

                    linha.appendChild(celula);
                });

                tabela.appendChild(linha);
            });

                if (registrosFiltrados.length === 0) {
                    tabela.innerHTML =
                        '<tr><td colspan="7">Nenhum registro encontrado.</td></tr>';
                }

            } // Fecha a função atualizarTabela()

            // Exibe os registros na tabela
            atualizarTabela();

            // Ativa os filtros
            campoBusca.addEventListener("input", atualizarTabela);
            filtroPeriodo.addEventListener("change", atualizarTabela);
            filtroCategoria.addEventListener("change", atualizarTabela);
            filtroStatus.addEventListener("change", atualizarTabela);
            filtroDispositivo.addEventListener("change", atualizarTabela);

            // Botão para limpar os filtros
            limparFiltros.addEventListener("click", () => {
                campoBusca.value = "";
                filtroPeriodo.value = "";
                filtroCategoria.value = "";
                filtroStatus.value = "";
                filtroDispositivo.value = "";

                atualizarTabela();
            });

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

    carregarHistorico();

});