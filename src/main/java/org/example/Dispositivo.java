package org.example;

public class Dispositivo {
    private int id_dispositivos;
    private String nome_dispositivo;
    private String localizacao;
    private String tipo_dispositivo;
    private int gatewai_pai_fk;

    public Dispositivo(int id_dispositivos, String nome_dispositivo, String localizacao, String tipo_dispositivo, int gatewai_pai_fk) {
        this.id_dispositivos = id_dispositivos;
        this.nome_dispositivo = nome_dispositivo;
        this.localizacao = localizacao;
        this.tipo_dispositivo = tipo_dispositivo;
        this.gatewai_pai_fk = gatewai_pai_fk;
    }


    public int getGatewai_pai_fk() {
        return gatewai_pai_fk;
    }

    public void setGatewai_pai_fk(int gatewai_pai_fk) {
        this.gatewai_pai_fk = gatewai_pai_fk;
    }

    public int getId_dispositivos() {
        return id_dispositivos;
    }

    public void setId_dispositivos(int id_dispositivos) {
        this.id_dispositivos = id_dispositivos;
    }

    public String getNome_dispositivo() {
        return nome_dispositivo;
    }

    public void setNome_dispositivo(String nome_dispositivo) {
        this.nome_dispositivo = nome_dispositivo;
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }

    public String getTipo_dispositivo() {
        return tipo_dispositivo;
    }

    public void setTipo_dispositivo(String tipo_dispositivo) {
        this.tipo_dispositivo = tipo_dispositivo;
    }

}
