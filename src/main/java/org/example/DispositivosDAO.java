package org.example;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

public class DispositivosDAO {

    public Dispositivo salvarDisp(Dispositivo dispositivos) throws SQLException {
        String sql = """
        INSERT INTO dispositivos
    (nome_dispositivo, localizacao,
     tipo_dispositivo, gatewai_pai_fk)
    VALUES (?, ?, ?, ?)
    """;

        String sqlHistorico = """
        INSERT INTO historico_dispositivos
        (id_dispositivos_fk, nome_dispositivo, acao, descricao, data_hora)
        VALUES (?, ?, ?, ?, ?)
        """;

        try (Connection conexao = Conexao.connection()) {

            // Inicia a transação
            conexao.setAutoCommit(false);

            try {
                // 1. Cadastra o dispositivo
                try (PreparedStatement comando = conexao.prepareStatement(
                        sql, Statement.RETURN_GENERATED_KEYS)) {


                    comando.setString(1, dispositivos.getNome_dispositivo());
                    comando.setString(2, dispositivos.getLocalizacao());
                    comando.setString(3, dispositivos.getTipo_dispositivo());

                    if (dispositivos.getGatewai_pai_fk() > 0) {
                        comando.setInt(4, dispositivos.getGatewai_pai_fk());
                    } else {
                        comando.setNull(4, java.sql.Types.INTEGER);
                    }


                    comando.executeUpdate();

                    try (ResultSet chaves = comando.getGeneratedKeys()) {
                        if (chaves.next()) {
                            dispositivos.setId_dispositivos(chaves.getInt(1));
                        }
                    }
                }

                // 2. Registra o cadastro no histórico
                try (PreparedStatement comandoHistorico =
                             conexao.prepareStatement(sqlHistorico)) {

                    comandoHistorico.setInt(
                            1, dispositivos.getId_dispositivos()
                    );

                    comandoHistorico.setString(
                            2, dispositivos.getNome_dispositivo()
                    );

                    comandoHistorico.setString(3, "CADASTRO");

                    comandoHistorico.setString(
                            4, "Dispositivo cadastrado em " +
                                    dispositivos.getLocalizacao()
                    );

                    comandoHistorico.setObject(
                            5, java.time.LocalDateTime.now()
                    );

                    comandoHistorico.executeUpdate();
                }

                // 3. Confirma as duas operações
                conexao.commit();

            } catch (SQLException erro) {
                // Desfaz as duas operações em caso de erro
                conexao.rollback();
                throw erro;
            }
        }

        return dispositivos;
    }


    public List<Dispositivo> listarDispDisponiveies() throws SQLException {
        String sql = """
                SELECT  id_dispositivos, nome_dispositivo, localizacao, tipo_dispositivo, gatewai_pai_fk  FROM dispositivos
                ORDER BY id_dispositivos
                """;
        List<Dispositivo> dispositvos = new ArrayList<>();
        try (Connection conexao = Conexao.connection();
             PreparedStatement comando = conexao.prepareStatement(sql);
             ResultSet resultado = comando.executeQuery()) {

            while (resultado.next()){
                Dispositivo dispositivo = new Dispositivo(
                        resultado.getInt("id_dispositivos"),
                        resultado.getString("nome_dispositivo"),
                        resultado.getString("localizacao"),
                        resultado.getString("tipo_dispositivo"),
                        resultado.getInt("gatewai_pai_fk")
                );
                dispositvos.add(dispositivo);
            }
        }
        return dispositvos;
    }

    public int contarDispositivosOnline() throws SQLException {

        String sql = """
        SELECT COUNT(*) AS total_online
        FROM dispositivos d
        WHERE EXISTS (
            SELECT 1
            FROM registro r
            WHERE r.id_dispositivos_fk = d.id_dispositivos
              AND r.data_hora >= NOW() - INTERVAL 5 MINUTE
              AND r.data_hora <= NOW()
        )
        """;

        try (Connection conexao = Conexao.connection();
             PreparedStatement comando = conexao.prepareStatement(sql);
             ResultSet resultado = comando.executeQuery()) {

            if (resultado.next()) {
                return resultado.getInt("total_online");
            }
        }

        return 0;
    }


    public List<Map<String, Object>> listarHistoricoDispositivos()
            throws SQLException {

        String sql = """
        SELECT
            id_historico,
            id_dispositivos_fk,
            nome_dispositivo,
            acao,
            descricao,
            data_hora
        FROM historico_dispositivos
        ORDER BY data_hora DESC, id_historico DESC
        """;

        List<Map<String, Object>> historico = new ArrayList<>();

        try (Connection conexao = Conexao.connection();
             PreparedStatement comando = conexao.prepareStatement(sql);
             ResultSet resultado = comando.executeQuery()) {

            while (resultado.next()) {

                Map<String, Object> evento = new HashMap<>();

                evento.put("id_historico",
                        resultado.getInt("id_historico"));

                evento.put("id_dispositivos_fk",
                        resultado.getInt("id_dispositivos_fk"));

                evento.put("nome_dispositivo",
                        resultado.getString("nome_dispositivo"));

                evento.put("acao",
                        resultado.getString("acao"));

                evento.put("descricao",
                        resultado.getString("descricao"));

                evento.put("data_hora",
                        resultado.getTimestamp("data_hora")
                                .toLocalDateTime().toString());

                historico.add(evento);
            }
        }

        return historico;
    }



    public boolean atualizarDispositivo(Dispositivo dispositivo)
            throws SQLException {

        String sqlBuscar = """
        SELECT nome_dispositivo, localizacao,
               tipo_dispositivo, gatewai_pai_fk
        FROM dispositivos
        WHERE id_dispositivos = ?
        FOR UPDATE
        """;

        String sqlAtualizar = """
        UPDATE dispositivos
        SET nome_dispositivo = ?,
            localizacao = ?,
            tipo_dispositivo = ?,
            gatewai_pai_fk = ?
        WHERE id_dispositivos = ?
        """;

        String sqlHistorico = """
        INSERT INTO historico_dispositivos
        (id_dispositivos_fk, nome_dispositivo, acao, descricao, data_hora)
        VALUES (?, ?, ?, ?, ?)
        """;

        try (Connection conexao = Conexao.connection()) {
            conexao.setAutoCommit(false);

            try {
                String nomeAntigo;
                String localAntigo;
                String tipoAntigo;
                Integer gatewayAntigo;

                // 1. Busca os dados antigos
                try (PreparedStatement comando =
                             conexao.prepareStatement(sqlBuscar)) {

                    comando.setInt(1, dispositivo.getId_dispositivos());

                    try (ResultSet resultado = comando.executeQuery()) {

                        if (!resultado.next()) {
                            conexao.rollback();
                            return false;
                        }

                        nomeAntigo = resultado.getString("nome_dispositivo");
                        localAntigo = resultado.getString("localizacao");
                        tipoAntigo = resultado.getString("tipo_dispositivo");

                        int gateway = resultado.getInt("gatewai_pai_fk");
                        gatewayAntigo = resultado.wasNull() ? null : gateway;
                    }
                }

                // 2. Compara os dados antigos com os novos
                List<String> alteracoes = new ArrayList<>();

                if (!java.util.Objects.equals(
                        nomeAntigo, dispositivo.getNome_dispositivo())) {

                    alteracoes.add(
                            "Nome: " + nomeAntigo + " → " +
                                    dispositivo.getNome_dispositivo()
                    );
                }

                if (!java.util.Objects.equals(
                        localAntigo, dispositivo.getLocalizacao())) {

                    alteracoes.add(
                            "Localização: " + localAntigo + " → " +
                                    dispositivo.getLocalizacao()
                    );
                }

                if (!java.util.Objects.equals(
                        tipoAntigo, dispositivo.getTipo_dispositivo())) {

                    alteracoes.add(
                            "Tipo: " + tipoAntigo + " → " +
                                    dispositivo.getTipo_dispositivo()
                    );
                }

                Integer gatewayNovo =
                        dispositivo.getGatewai_pai_fk() > 0
                                ? dispositivo.getGatewai_pai_fk()
                                : null;

                if (!java.util.Objects.equals(gatewayAntigo, gatewayNovo)) {
                    alteracoes.add(
                            "Gateway: " + gatewayAntigo + " → " + gatewayNovo
                    );
                }

                // Não cria evento quando nada mudou
                if (alteracoes.isEmpty()) {
                    conexao.commit();
                    return true;
                }

                // 3. Atualiza os dados do dispositivo
                try (PreparedStatement comando =
                             conexao.prepareStatement(sqlAtualizar)) {

                    comando.setString(1, dispositivo.getNome_dispositivo());
                    comando.setString(2, dispositivo.getLocalizacao());
                    comando.setString(3, dispositivo.getTipo_dispositivo());

                    if (gatewayNovo != null) {
                        comando.setInt(4, gatewayNovo);
                    } else {
                        comando.setNull(4, Types.INTEGER);
                    }

                    comando.setInt(5, dispositivo.getId_dispositivos());
                    comando.executeUpdate();
                }

                // 4. Registra as alterações no histórico
                try (PreparedStatement comando =
                             conexao.prepareStatement(sqlHistorico)) {

                    comando.setInt(1, dispositivo.getId_dispositivos());
                    comando.setString(2, dispositivo.getNome_dispositivo());
                    comando.setString(3, "ALTERACAO");

                    comando.setString(
                            4,
                            String.join("; ", alteracoes)
                    );

                    comando.setObject(
                            5,
                            java.time.LocalDateTime.now()
                    );

                    comando.executeUpdate();
                }

                // 5. Confirma as operações
                conexao.commit();
                return true;

            } catch (SQLException | RuntimeException erro) {
                try {
                    conexao.rollback();
                } catch (SQLException erroRollback) {
                    erro.addSuppressed(erroRollback);
                }
                throw erro;
            }
        }
    }



}
