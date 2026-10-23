package org.example;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DispositivosDAO {

    public Dispositivo salvarDisp(Dispositivo dispositivos) throws SQLException {
        String sql = """
                INSERT INTO Dispositivos( id_dispositivo, nome_dispositivo, localizacao, tipo_dispositivo, gatewai_pai_fk )
                VALUE (?, ?, ?, ?, ?)
                """;
        try (Connection conexao = Conexao.connection();
             PreparedStatement comando = conexao.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            //Statement:  envia os comandos do SQL pronto pro banco

            comando.setInt(1, dispositivos.getId_dispositivo());
            comando.setString(2, dispositivos.getNome_dispositivo());
            comando.setString(3, dispositivos.getLocalizacao());
            comando.setString(4, dispositivos.getTipo_dispositivo());
            comando.setInt(5, dispositivos.getGatewai_pai_fk());
            comando.executeUpdate();
            try (ResultSet chaves = comando.getGeneratedKeys()) {
                if (chaves.next()) {
                    dispositivos.setId_dispositivo(chaves.getInt(1));
                }
            }
        }
        return dispositivos;
    }


    public List<Dispositivo> listarDispDisponiveies() throws SQLException {
        String sql = """
                SELECT  id_dispositivo, nome_dispositivo, localizacao, tipo_dispositivo, gatewai_pai_fk
                FROM Dispositivos
                ORDER BY id_dispositivos
                """;
        List<Dispositivo> dispositvos = new ArrayList<>();
        try (Connection conexao = Conexao.connection();
             PreparedStatement comando = conexao.prepareStatement(sql);
             ResultSet resultado = comando.executeQuery()) {

            while (resultado.next()){
                Dispositivo dispositivo = new Dispositivo(
                        resultado.getInt("id_dispositivo"),
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
}
