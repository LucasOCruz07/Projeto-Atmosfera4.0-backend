package org.example;

import java.sql.SQLException;


public class Main {
    public static void main(String[] args) throws SQLException {

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


        atuadoresDAO.listarAtuaDisponiveies();
        dispositivosDAO.listarDispDisponiveies();
        registrosDAO.listarRegis_Disponiveies();



    }
}