package org.example;

public class Registros {
    private long id_registro;
    private int id_dispositivos_fk;
    private String time_stamp; // estou em discussão sobre o tipo de dado "timestamp" do banco de dados
    // por enquatno deixei como String, com o "_" pq o JDBC confunde com o tipo de dado do MySQL

    private float temperatura;
    private float umidade;
    private float pressao;
    private float altitude;
    private float luminosidade;
    private float velocidade_vento;
    private int direcao_vento;
    private float intensidade_wifi;

<<<<<<< HEAD
    public Registros(long id_registro,int id_dispositivos_fk, String time_stamp, String data_hora, float temperatura, float umidade, float pressao, float altitude, float luminosidade, float velocidade_vento, int direcao_vento, float intensidade_wifi) {
=======
    public Registros(long id_registro, String time_stamp, float temperatura, float umidade, float pressao, float altitude, float luminosidade, float velocidade_vento, int direcao_vento, float intensidade_wifi) {
>>>>>>> e346f313be8cc96284c57ffdb47e9e0a8f6b24e5

        this.id_registro = id_registro;
        this.id_dispositivos_fk = id_dispositivos_fk;
        this.time_stamp = time_stamp;
        this.temperatura = temperatura;
        this.umidade = umidade;
        this.pressao = pressao;
        this.altitude = altitude;
        this.luminosidade = luminosidade;
        this.velocidade_vento = velocidade_vento;
        this.direcao_vento = direcao_vento;
        this.intensidade_wifi = intensidade_wifi;

    }

    public long getId_registro() {
        return id_registro;
    }

    public void setId_registro(long id_registro) {
        this.id_registro = id_registro;
    }

    public int getId_dispositivos_fk() {
        return id_dispositivos_fk;
    }

    public void setId_dispositivos_fk(int id_dispositivos_fk) {
        this.id_dispositivos_fk = id_dispositivos_fk;
    }

    public String getTime_stamp() {
        return time_stamp;
    }

    public void setTimestamp(String time_stamp) {
        this.time_stamp = time_stamp;
    }


    public float getTemperatura() {
        return temperatura;
    }

    public void setTemperatura(float temperatura) {
        this.temperatura = temperatura;
    }

    public float getUmidade() {
        return umidade;
    }

    public void setUmidade(float umidade) {
        this.umidade = umidade;
    }

    public float getPressao() {
        return pressao;
    }

    public void setPressao(float pressao) {
        this.pressao = pressao;
    }

    public float getAltitude() {
        return altitude;
    }

    public void setAltitude(float altitude) {
        this.altitude = altitude;
    }

    public float getLuminosidade() {
        return luminosidade;
    }

    public void setLuminosidade(float luminosidade) {
        this.luminosidade = luminosidade;
    }

    public float getVelocidade_vento() {
        return velocidade_vento;
    }

    public void setVelocidade_vento(float velocidade_vento) {
        this.velocidade_vento = velocidade_vento;
    }

    public int getDirecao_vento() {
        return direcao_vento;
    }

    public void setDirecao_vento(int direcao_vento) {
        this.direcao_vento = direcao_vento;
    }

    public float getIntensidade_wifi() {
        return intensidade_wifi;
    }

    public void setIntensidade_wifi(float intensidade_wifi) {
        this.intensidade_wifi = intensidade_wifi;
    }
}
