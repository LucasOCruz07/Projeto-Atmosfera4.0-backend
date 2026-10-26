package org.example;

import java.sql.SQLException;


public class Main {
    public static void main(String[] args) throws SQLException {

<<<<<<< HEAD


        Conexao.testar();




       AtuadoresDAO atuadoresDAO = new AtuadoresDAO();
        DispositivosDAO dispositivosDAO = new DispositivosDAO();
        RegistrosDAO registrosDAO = new RegistrosDAO();

        atuadoresDAO.salvarAtua(new Atuadores(0, 0, "rafamelo", false, "2026-10-22 10:00:00"));
        dispositivosDAO.salvarDisp(new Dispositivo(0,"marcusVini", "Pirituba","tipoé", 2 ));
        registrosDAO.salvarRegis(new Registros(0, 0, "São Paulo - Brazil 2026-10-22 10:00:00", "2026-10-22 10:00:00", 38, 40, 60, 50, 45, 40, 10, 34));
=======
        /*
        rteste de conexao com o MySQL
        Conexao.testar();
        */


        AtuadoresDAO atuadoresDAO = new AtuadoresDAO();
        DispositivosDAO dispositivosDAO = new DispositivosDAO();
        RegistrosDAO registrosDAO = new RegistrosDAO();

        atuadoresDAO.salvarAtua(new Atuadores(01, "Termometro", false, "2026-10-22 10:00:00","22°"));
        dispositivosDAO.salvarDisp(new Dispositivo(01,"marcusVini", "Pirituba","tipoé", 1 ));
        registrosDAO.salvarRegis(new Registros(01, "São Paulo - Brazil 2026-10-22 10:00:00", 38, 40, 60, 50, 45, 40, 10, 34));
>>>>>>> e346f313be8cc96284c57ffdb47e9e0a8f6b24e5


        atuadoresDAO.listarAtuaDisponiveies();
        dispositivosDAO.listarDispDisponiveies();
        registrosDAO.listarRegis_Disponiveies();



    }
}