package org.example;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AtuadoresDAO {

    public Atuadores salvar(Atuadores atuadores) throws SQLException {
        String sql = """
                INSERT INTO Atuadores ( id_atuadores, nome_atuador, status_atual, ultimo_comando)
                VALUE (?, ?, ?, ?)
                """;
        try (Connection conexao = Conexao.connection();
             PreparedStatement comando = conexao.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            //Statement:  envia os comandos do SQL pronto pro banco

            comando.setInt(1, atuadores.getId_atuador());
            comando.setString(2, atuadores.getNome_atuador());
            comando.setBoolean(3, atuadores.getStatus_atual());
            comando.setString(4, atuadores.getUltimo_comando());
            comando.executeUpdate();
            try (ResultSet chaves = comando.getGeneratedKeys()) {
                if (chaves.next()) {
                    atuadores.setId_atuador(chaves.getInt(1));
                }

            }

        }
        return atuadores;
    }


    public List<Atuadores> listarDisponiveies() throws SQLException {
        String sql = """
                SELECT id_atuador, nome_atuador, status_atual, ultimo_comando
                FROM Atuadores
                ORDER BY id_atuador
                """;
        List<Atuadores> atuadores = new ArrayList<>();
        try (Connection conexao = Conexao.connection();
             PreparedStatement comando = conexao.prepareStatement(sql);
             ResultSet resultado = comando.executeQuery()) {

            while (resultado.next()){
                Atuadores atuador = new Atuadores(
                        resultado.getInt("id_atuador"),
                        resultado.getString("nome_atuador"),
                        resultado.getBoolean("status_atual"),
                        resultado.getString("ultimo_comando")
                );
                atuadores.add(atuador);
            }
        }
        return atuadores;
    }

}