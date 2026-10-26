package org.example;

import java.sql.Connection;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Conexao {
<<<<<<< HEAD
    private static final String URL = "jdbc:mysql://localhost:3306/atmosfera"
            + "?useSSL=false"
            + "&allowPublicKeyRetrieval=true"
            + "&serverTimezone=America/Sao_Paulo";
=======
    //Alterar nome do banco se preciso /NOME
    private static final String URL = "jdbc:mysql://localhost:3306/bancoteste";
//    + "?useSSL = false "
//           + "&allowPublicKeyRetriveal = true"
//     + "&serverTimezone = America/Sao_Paulo";

>>>>>>> e346f313be8cc96284c57ffdb47e9e0a8f6b24e5

// permite que o  drive JDBC  solicite ao MySQL uma chave publica durante a autenticacao

    private static final String USUARIO = "root";
    private  static  final String SENHA = "senaisp";



    private Conexao(){}

    public static Connection connection  () throws SQLException{
        return DriverManager.getConnection(URL, USUARIO, SENHA);
    }

    public static void testar() throws SQLException{
        try (Connection conexao = connection()) {
            if (!conexao.isValid(2)){
                throw new SQLException("Não foi possivel fazer a conexão com o MySQL !");
            }
        }
    }

}

