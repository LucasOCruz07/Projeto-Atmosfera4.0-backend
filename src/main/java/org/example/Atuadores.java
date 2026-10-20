package org.example;

public class Atuadores {
    private int id_atuador;
    private String nome_atuador; // la no banco esta co mo varchar, deixei como String porem pode ser mudado
    private  Boolean status_atual;

    private String ultimo_comando; // fazer possivel troca, pois no banco o "ultimo_comando" esta como datetime

    public Atuadores(int id_atuador, String nome_atuador, Boolean status_atual, String ultimo_comando) {
        this.id_atuador = id_atuador;
        this.nome_atuador = nome_atuador;
        this.status_atual = status_atual;
        this.ultimo_comando = ultimo_comando;
    }

    public int getId_atuador() {
        return id_atuador;
    }

    public void setId_atuador(int id_atuador) {
        this.id_atuador = id_atuador;
    }

    public String getNome_atuador() {
        return nome_atuador;
    }

    public void setNome_atuador(String nome_atuador) {
        this.nome_atuador = nome_atuador;
    }

    public Boolean getStatus_atual() {
        return status_atual;
    }

    public void setStatus_atual(Boolean status_atual) {
        this.status_atual = status_atual;
    }

    public String getUltimo_comando() {
        return ultimo_comando;
    }

    public void setUltimo_comando(String ultimo_comando) {
        this.ultimo_comando = ultimo_comando;
    }
}
