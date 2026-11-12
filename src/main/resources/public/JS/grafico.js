document.addEventListener("DOMContentLoaded", async () => {

    const canvas = document.getElementById("graficoRosca");

    if (!canvas) {
        console.error("ERRO: Canvas graficoRosca não encontrado!");
        return;
    }

    console.log("Canvas encontrado:", canvas);
    console.log("Chart.js carregado:", typeof Chart);



    try {
        const [respostaDispositivos, respostaRegistros] =
            await Promise.all([
                fetch("/api/dispositivos"),
                fetch("/api/registros")
            ]);

        if (!respostaDispositivos.ok || !respostaRegistros.ok) {
            throw new Error("Erro ao buscar dados do gráfico");
        }

        const dispositivos = await respostaDispositivos.json();
        const registros = await respostaRegistros.json();

        console.log("Dispositivos:", dispositivos);
        console.log("Registros:", registros);

        // Guarda a medição mais recente de cada dispositivo
        const ultimosRegistros = new Map();

        registros.forEach(registro => {
            const id = Number(registro.id_dispositivos_fk);

            const data = new Date(
                String(registro.time_stamp).replace(" ", "T")
            );

            if (isNaN(data.getTime())) return;

            const anterior = ultimosRegistros.get(id);

            if (!anterior || data > anterior.data) {
                ultimosRegistros.set(id, { registro, data });
            }
        });

        // Uma fatia para cada dispositivo cadastrado
        const cores = [
            "#3b82f6",
            "#22c55e",
            "#f59e0b",
            "#a855f7",
            "#ef4444",
            "#06b6d4"
        ];

        new Chart(canvas, {
                    type: "doughnut",

                    data: {
                        labels: dispositivos.map(d => d.nome_dispositivo),

                        datasets: [{
                            label: "Dispositivos",

                            data: dispositivos.map(() => 1),

                            backgroundColor: [
                                                    "#80fcc2", // Verde claro principal
                                                    "#78b9f5", // Azul claro principal
                                                    "#ffffffda", // Branco translúcido
                                                    "#45d497", // Um tom de verde um pouco mais fechado para o 4º dispositivo
                                                    "#4ba3e3", // Um tom de azul um pouco mais fechado para o 5º dispositivo
                                                    "#d0f5e4"  // Um tom verde-gelo bem suave para o 6º dispositivo
                                                ],

                            borderColor: "#69f8e533",
                            borderWidth: 2,
                            hoverOffset: 4
                        }]
                    },

            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "48%",

                plugins: {
                    legend: {
                        display: true,
                        position: "top",

                        labels: {
                            color: "#ffffff",
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
                        callbacks: {
                            label: function(context) {
                                const dispositivo =
                                    dispositivos[context.dataIndex];

                                return dispositivo.nome_dispositivo;
                            },

                            afterLabel: function(context) {
                                const dispositivo =
                                    dispositivos[context.dataIndex];

                                const dados = ultimosRegistros.get(
                                    Number(dispositivo.id_dispositivos)
                                );

                                if (!dados) {
                                    return [
                                        `Local: ${dispositivo.localizacao}`,
                                        "Sem medições registradas",
                                        "Status: Offline"
                                    ];
                                }

                                const registro = dados.registro;

                                const online =
                                    Date.now() - dados.data.getTime()
                                    <= 5 * 60 * 1000 &&
                                    Date.now() >= dados.data.getTime();

                                return [
                                    `Local: ${dispositivo.localizacao}`,
                                    `Tipo: ${dispositivo.tipo_dispositivo}`,
                                    `Temperatura: ${registro.temperatura} °C`,
                                    `Umidade: ${registro.umidade} %`,
                                    `Última medição: ${registro.time_stamp}`,
                                    `Status: ${online ? "Online" : "Offline"}`
                                ];
                            }
                        }
                    }
                }
            }
        });

    } catch (erro) {
        console.error("Erro no gráfico de dispositivos:", erro);
    }
});