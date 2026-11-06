package org.example;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class AtuadoresDAO {

    public Atuadores salvarAtua(Atuadores atuadores) throws SQLException {
        String sql = """
                INSERT INTO Atuadores ( id_atuadores, id_dispositivos_fk, nome_atuador, status_atual, ultimo_comando)
                VALUE (?, ?, ?, ?, ?)
                """;
        try (Connection conexao = Conexao.connection();
             PreparedStatement comando = conexao.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            //Statement:  envia os comandos do SQL pronto pro banco

            comando.setInt(1, atuadores.getId_atuadores());
            comando.setInt(2, atuadores.getId_dispositivos_fk());
            comando.setString(3, atuadores.getNome_atuador());
            comando.setBoolean(4, atuadores.getStatus_atual());
            comando.setObject(5, (LocalDateTime) atuadores.getUltimo_comando());
            comando.executeUpdate();
            try (ResultSet chaves = comando.getGeneratedKeys()) {
                if (chaves.next()) {
                    atuadores.setId_atuadores(chaves.getInt(1));
                }

            }
        }
        return atuadores;
    }



    public List<Atuadores> listarAtuaDisponiveies() throws SQLException {
        String sql = """
                SELECT id_atuadores, id_dispositivos_fk,  nome_atuador, status_atual, ultimo_comando
                FROM atuadores
                ORDER BY id_atuadores
                """;
        List<Atuadores> atuadores = new ArrayList<>();
        try (Connection conexao = Conexao.connection();
             PreparedStatement comando = conexao.prepareStatement(sql);
             ResultSet resultado = comando.executeQuery()) {

            while (resultado.next()){
                Atuadores atuador = new Atuadores(
                        resultado.getInt("id_atuadores"),
                        resultado.getInt("id_dispositivos_fk"),
                        resultado.getString("nome_atuador"),
                        resultado.getBoolean("status_atual"),
                        (LocalDateTime) resultado.getObject( "ultimo_comando")
                );
                atuadores.add(atuador);
            }
        }
        return atuadores;
    }


    public boolean alterarStatusAtuador(int idAtuador, boolean novoStatus)
            throws SQLException {

        String sqlAtualizar = """
            UPDATE atuadores
            SET status_atual = ?, ultimo_comando = ?
            WHERE id_atuadores = ?
            """;

        String sqlHistorico = """
            INSERT INTO historico_atuadores
            (id_atuadores_fk, status_novo, data_hora)
            VALUES (?, ?, ?)
            """;

        try (Connection conexao = Conexao.connection()) {

            conexao.setAutoCommit(false);

            try {
                LocalDateTime agora = LocalDateTime.now();

                // Atualiza o estado atual do atuador
                int linhasAlteradas;

                try (PreparedStatement comando =
                             conexao.prepareStatement(sqlAtualizar)) {

                    comando.setBoolean(1, novoStatus);
                    comando.setObject(2, agora);
                    comando.setInt(3, idAtuador);

                    linhasAlteradas = comando.executeUpdate();
                }

                // Se o atuador não existir, não cria histórico
                if (linhasAlteradas == 0) {
                    conexao.rollback();
                    return false;
                }

                // Registra o comando no histórico
                try (PreparedStatement comando =
                             conexao.prepareStatement(sqlHistorico)) {

                    comando.setInt(1, idAtuador);
                    comando.setBoolean(2, novoStatus);
                    comando.setObject(3, agora);

                    comando.executeUpdate();
                }

                // Confirma as duas operações no banco
                conexao.commit();

                return true;

            } catch (SQLException erro) {
                conexao.rollback();
                throw erro;
            }
        }
    }


}