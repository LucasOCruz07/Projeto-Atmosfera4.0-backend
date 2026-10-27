package org.example;


import java.sql.Time;
import java.time.LocalDateTime;

public class Atuadores {
    private int id_atuador;
    private int id_dispositivos_fk;
    private String nome_atuador; // la no banco esta co mo varchar, deixei como String porem pode ser mudado
    private Boolean status_atual;
    private LocalDateTime ultimo_comando;// fazer possivel troca, pois no banco o "ultimo_comando" esta como datetime
    //ultimo_comando (20/10/26 | 10:20)





    public Atuadores(int id_atuador, int id_dispositivos_fk, String nome_atuador, Boolean status_atual, LocalDateTime ultimo_comando){

            this.id_atuador = id_atuador;
            this.id_dispositivos_fk = id_dispositivos_fk;
            this.nome_atuador = nome_atuador;
            this.status_atual = status_atual;
            this.ultimo_comando = ultimo_comando;

        }

        public int getId_atuador () {
            return id_atuador;
        }

        public void setId_atuador ( int id_atuador){
            this.id_atuador = id_atuador;
        }

        public int getId_dispositivos_fk () {
            return id_dispositivos_fk;
        }

        public void setId_dispositivos_fk ( int id_dispositivos_fk){
            this.id_dispositivos_fk = id_dispositivos_fk;
        }

        public String getNome_atuador () {
            return nome_atuador;
        }

        public void setNome_atuador (String nome_atuador){
            this.nome_atuador = nome_atuador;
        }

        public Boolean getStatus_atual () {
            return status_atual;
        }

        public void setStatus_atual (Boolean status_atual){
            this.status_atual = status_atual;
        }

        public LocalDateTime getUltimo_comando () {
            return ultimo_comando;
        }

        public void setUltimo_comando (LocalDateTime ultimo_comando){
            this.ultimo_comando = ultimo_comando;
        }

    }
