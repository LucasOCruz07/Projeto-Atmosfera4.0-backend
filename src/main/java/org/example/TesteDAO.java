package org.example;

import java.sql.SQLException;

public class TesteDAO {
<<<<<<< HEAD
/*
=======
>>>>>>> e346f313be8cc96284c57ffdb47e9e0a8f6b24e5
    public static void main(String[] args)  throws SQLException {

        AtuadoresDAO atuadoresDAO = new AtuadoresDAO();
        DispositivosDAO dispositivosDAO = new DispositivosDAO();
        RegistrosDAO registrosDAO = new RegistrosDAO();

<<<<<<< HEAD
        atuadoresDAO.salvarAtua(new Atuadores(01, "rafamelo", false, "Desligar"));
        dispositivosDAO.salvarDisp(new Dispositivo(01,"marcusVini", "Pirituba","tipoé", 1 ));
        registrosDAO.salvarRegis(new Registros(01, "São Paulo - Brazil 2026-10-22 10:00:00", "2026-10-22 10:00:00", 38, 40, 60, 50, 45, 40, 10, 34));


        atuadoresDAO.listarAtuaDisponiveies();
        dispositivosDAO.listarDispDisponiveies();
        registrosDAO.listarRegis_Disponiveies();
    }*/
=======
        atuadoresDAO.salvarAtua(new Atuadores(01, "rafamelo", false, "Desligar","27°"));
        dispositivosDAO.salvarDisp(new Dispositivo(01, "marcusVini", "Pirituba", "tipoé", 1));
        registrosDAO.salvarRegis(new Registros(01, "São Paulo - Brazil 2026-10-22 10:00:00",5, 40, 60, 50, 45, 40, 10, 34));


 //   atuadoresDAO.listarAtuaDisponiveies();
  //  dispositivosDAO.listarDispDisponiveies();
   //  registrosDAO.listarRegis_Disponiveies();

    }
>>>>>>> e346f313be8cc96284c57ffdb47e9e0a8f6b24e5
}
