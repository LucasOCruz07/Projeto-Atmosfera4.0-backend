document.addEventListener("DOMContentLoaded", () => {

    const tabela = document.getElementById("linhasEventos");

    async function carregarHistorico() {
        try {
            // Busca os registros no backend Java
            const resposta = await fetch("/api/registros");

            if (!resposta.ok) {
                throw new Error("Erro ao buscar registros");
            }

            // Converte a resposta JSON em objetos JavaScript
            const registros = await resposta.json();

            // Organiza do registro mais recente para o mais antigo
            registros.sort((a, b) => b.id_registro - a.id_registro);

            // Remove a mensagem "Carregando histórico..."
            tabela.innerHTML = "";

            // Cria uma linha para cada registro do banco
            registros.forEach(registro => {

                const temperatura = Number(registro.temperatura);
                const umidade = Number(registro.umidade);

                // Verifica os limites dos sensores
                const status = temperatura >= 25 ||
                               umidade < 40 ||
                               umidade > 60
                    ? "Aviso"
                    : "Normal";

                const linha = document.createElement("tr");

                const valores = [
                    registro.time_stamp ?? "-",
                    "Leitura",
                    `Dispositivo ${registro.id_dispositivos_fk}`,
                    "Registro de sensores",
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

            if (registros.length === 0) {
                tabela.innerHTML =
                    '<tr><td colspan="7">Nenhum registro encontrado.</td></tr>';
            }

        } catch (erro) {
            console.error("Erro ao carregar histórico:", erro);

            tabela.innerHTML =
                '<tr><td colspan="7">Erro ao carregar histórico.</td></tr>';
        }
    }

    carregarHistorico();

});