package org.example;

import java.sql.SQLException;
import java.time.LocalDateTime;


public class Main {
    public static void main(String[] args) throws SQLException {



        /*
        teste de conexao com o MySQL
        Conexao.testar();
        */


       AtuadoresDAO atuadoresDAO = new AtuadoresDAO();
        DispositivosDAO dispositivosDAO = new DispositivosDAO();
        RegistrosDAO registrosDAO = new RegistrosDAO();

        atuadoresDAO.salvarAtua(new Atuadores(0, 1, "rafamelo", false,LocalDateTime.now() ));
        dispositivosDAO.salvarDisp(new Dispositivo(0,"marcusVini", "Pirituba","tipoé", 1 ));
        registrosDAO.salvarRegis(new Registros(0L, 1, "São Paulo - Brazil 2026-10-22 10:00:00", LocalDateTime.now(), 38.0f, 40.0f, 60.0f, 50.0f, 45.0f, 40.0f, 10, 34.8f));



/*
        atuadoresDAO.listarAtuaDisponiveies();
        dispositivosDAO.listarDispDisponiveies();
        registrosDAO.listarRegis_Disponiveies();
*/


    }
}