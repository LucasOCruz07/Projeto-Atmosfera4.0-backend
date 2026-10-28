package org.example;

import com.google.gson.Gson;

import java.sql.SQLException;
import java.time.LocalDateTime;


public class Main {


    private static final int PORTA = 8080;
    private static final Gson GSON = new Gson();
    private static final AtuadoresDAO ATUADORES_DAO = new AtuadoresDAO();
    private static final DispositivosDAO DISPOSITIVOS_DAO = new DispositivosDAO();
    private static final RegistrosDAO REGISTROS_DAO = new RegistrosDAO();



    public static void main(String[] args) throws SQLException {


        /*teste de conexao com o MySQL
        Conexao.testar();*/





        /*
        AtuadoresDAO atuadoresDAO = new AtuadoresDAO();
        DispositivosDAO dispositivosDAO = new DispositivosDAO();
        RegistrosDAO registrosDAO = new RegistrosDAO();


        atuadoresDAO.salvarAtua(new Atuadores(0, 1, "rafamelo", false,LocalDateTime.now() ));
        dispositivosDAO.salvarDisp(new Dispositivo(0,"marcusVini", "Pirituba","tipoé", 1 ));
        registrosDAO.salvarRegis(new Registros(0L, 1, "2026-10-28_09-59-00", LocalDateTime.now(), 38.0f, 40.0f, 60.0f, 50.0f, 45.0f, 40.0f, 10, 34.8f));


        atuadoresDAO.listarAtuaDisponiveies();
        dispositivosDAO.listarDispDisponiveies();
        registrosDAO.listarRegis_Disponiveies();
        */

    }
}