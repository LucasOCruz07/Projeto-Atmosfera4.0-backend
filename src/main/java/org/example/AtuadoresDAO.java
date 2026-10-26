package org.example;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AtuadoresDAO {

    public Atuadores salvarAtua(Atuadores atuadores) throws SQLException {
        String sql = """
                INSERT INTO Atuadores ( id_atuadores, id_dispositivo_fk, nome_atuador, status_atual, ultimo_comando)
                VALUE (?, ?, ?, ?, ?)
                """;
        try (Connection conexao = Conexao.connection();
             PreparedStatement comando = conexao.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            //Statement:  envia os comandos do SQL pronto pro banco

            comando.setInt(1, atuadores.getId_atuador());
<<<<<<< HEAD
            comando.setInt(2, atuadores.getId_dispositivos_fk());
            comando.setString(3, atuadores.getNome_atuador());
            comando.setBoolean(4, atuadores.getStatus_atual());
            comando.setString(5, atuadores.getUltimo_comando());
=======
            comando.setString(2, atuadores.getNome_atuador());
            comando.setBoolean(3, atuadores.getStatus_atual());
            comando.setString(4, atuadores.getUltimo_comando());
>>>>>>> e346f313be8cc96284c57ffdb47e9e0a8f6b24e5
            comando.
                    executeUpdate();
            try (ResultSet chaves = comando.getGeneratedKeys()) {
                if (chaves.next()) {
                    atuadores.setId_atuador(chaves.getInt(1));
                }

            }
        }
        return atuadores;
    }

<<<<<<< HEAD

    public List<Atuadores> listarAtuaDisponiveies() throws SQLException {
        String sql = """
                SELECT id_atuador, id_dispositivo_fk,  nome_atuador, status_atual, ultimo_comando
=======
    public List<Atuadores> listarAtuaDisponiveies() throws SQLException {
        String sql = """
                SELECT id_atuador, nome_atuador, status_atual, ultimo_registro
>>>>>>> e346f313be8cc96284c57ffdb47e9e0a8f6b24e5
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
                        resultado.getInt("id_dispositivo_fk"),
                        resultado.getString("nome_atuador"),
                        resultado.getBoolean("status_atual"),
                        resultado.getString("ultimo_comando"),
                        resultado.getString("resultado_iot")
                );
                atuadores.add(atuador);
            }
        }
        return atuadores;
    }

}