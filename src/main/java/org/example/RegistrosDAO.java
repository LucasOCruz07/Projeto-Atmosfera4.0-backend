package org.example;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class RegistrosDAO {
        public Registros salvarRegis(Registros registros) throws SQLException {
        String sql = """
<<<<<<< HEAD
                INSERT INTO registro( id_registro, id_dispositivos_fk, time_stamp, data_hora,temperatura, umidade, pressao, altitude, luminosidade, velocidade_vento, direcao_vento, intensidade_wifi)
                VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
=======
                INSERT INTO registro( id_registro, time_stamp,temperatura, umidade, pressao, altitude, luminosidade, velocidade_vento, direcao_vento, intensidade_wifi)
                VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
>>>>>>> e346f313be8cc96284c57ffdb47e9e0a8f6b24e5
                """;
        try (Connection conexao = Conexao.connection();
             PreparedStatement comando = conexao.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            //Statement:  envia os comandos do SQL pronto pro banco

            comando.setLong(1, registros.getId_registro());
<<<<<<< HEAD
            comando.setInt(2, registros.getId_dispositivos_fk());
            comando.setString(3, registros.getTime_stamp());
            comando.setString(4, registros.getData_hora());
            comando.setFloat(5, registros.getTemperatura());
            comando.setFloat(6, registros.getUmidade());
            comando.setFloat(7, registros.getPressao());
            comando.setFloat(8, registros.getAltitude());
            comando.setFloat(9, registros.getLuminosidade());
            comando.setInt(10 ,registros.getDirecao_vento());
            comando.setFloat(11, registros.getIntensidade_wifi() );
=======
            comando.setString(2, registros.getTime_stamp());
            comando.setFloat(3, registros.getTemperatura());
            comando.setFloat(4, registros.getUmidade());
            comando.setFloat(5, registros.getPressao());
            comando.setFloat(6, registros.getAltitude());
            comando.setFloat(7, registros.getLuminosidade());
            comando.setFloat(8,registros.getVelocidade_vento());
            comando.setInt(9 ,registros.getDirecao_vento());
            comando.setFloat(10, registros.getIntensidade_wifi() );
>>>>>>> e346f313be8cc96284c57ffdb47e9e0a8f6b24e5
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
<<<<<<< HEAD
                SELECT  id_registro, id_dispositivos_fk, time_stamp, data_hora,temperatura, umidade, pressao, altitude, luminosidade, velocidade_vento, direcao_vento, intensidade_wifi
=======
                SELECT  id_registro, time_stamp,temperatura, umidade, pressao, altitude, luminosidade, velocidade_vento, direcao_vento, intensidade_wifi
>>>>>>> e346f313be8cc96284c57ffdb47e9e0a8f6b24e5
                FROM registro
                ORDER BY id_dispositivos
                """;
        List<Registros> registros = new ArrayList<>();
        try (Connection conexao = Conexao.connection();
             PreparedStatement comando = conexao.prepareStatement(sql);
             ResultSet resultado = comando.executeQuery()) {

            while (resultado.next()){
                Registros registro = new Registros(
<<<<<<< HEAD
                        resultado.getLong("id_dispositivo"),
                        resultado.getInt("id_dispositivos_fk"),
=======
                        resultado.getLong("id_registro"),
>>>>>>> e346f313be8cc96284c57ffdb47e9e0a8f6b24e5
                        resultado.getString("time_stamp"),
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
