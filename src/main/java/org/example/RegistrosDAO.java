package org.example;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class RegistrosDAO {
        public Registros salvarRegis(Registros registros) throws SQLException {
        String sql = """
                INSERT INTO registro(id_dispositivos_fk, time_stamp, data_hora, temperatura, umidade, pressao, altitude, luminosidade, velocidade_vento, direcao_vento, intensidade_wifi)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;
        try (Connection conexao = Conexao.connection();
             PreparedStatement comando = conexao.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            //Statement:  envia os comandos do SQL pronto pro banco

            comando.setInt(1, registros.getId_dispositivos_fk());
            comando.setString(2, registros.getTime_stamp());
            comando.setObject(3, registros.getData_hora());
            comando.setFloat(4, registros.getTemperatura());
            comando.setFloat(5, registros.getUmidade());
            comando.setFloat(6, registros.getPressao());
            comando.setFloat(7, registros.getAltitude());
            comando.setFloat(8, registros.getLuminosidade());
            comando.setFloat(9, registros.getVelocidade_vento());
            comando.setInt(10, registros.getDirecao_vento());
            comando.setFloat(11, registros.getIntensidade_wifi());

            comando.executeUpdate();
            try (ResultSet chaves = comando.getGeneratedKeys()) {
                if (chaves.next()) {
                    registros.setId_registro(chaves.getLong(1));
                }

            }

        }
        return registros;
    }


    public List<Registros> listarRegis_Disponiveies() throws SQLException {
        String sql = """
                SELECT  id_registro, id_dispositivos_fk, time_stamp, data_hora,temperatura, umidade, pressao, altitude, luminosidade, velocidade_vento, direcao_vento, intensidade_wifi
                FROM registro
                ORDER BY id_registro
                """;
        List<Registros> registros = new ArrayList<>();
        try (Connection conexao = Conexao.connection();
             PreparedStatement comando = conexao.prepareStatement(sql);
             ResultSet resultado = comando.executeQuery()) {

            while (resultado.next()){
                Registros registro = new Registros(

                        resultado.getLong("id_registro"),
                        resultado.getInt("id_dispositivos_fk"),
                        resultado.getString("time_stamp"),
                        (LocalDateTime) resultado.getObject( "data_hora"),
                        resultado.getFloat("temperatura"),
                        resultado.getFloat("umidade"),
                        resultado.getFloat("pressao"),
                        resultado.getFloat("altitude"),
                        resultado.getFloat("luminosidade"),
                        resultado.getFloat("velocidade_vento"),
                        resultado.getInt("direcao_vento"),
                        resultado.getFloat("intensidade_wifi")
                );
               registros.add(registro);
            }
        }
        return registros;
    }

}
