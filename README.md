FALTA TERMINAR O TesteDAO, e FAZER a main
(USAR DE REFERENCIA projetos fullstack do Orrico)



deixei em aberto a questao de algumas variaveis como:
"nome_atuador"
"ultimo_comando"

Pois estao dadas como varChar, datetime, timestamp..
Fico aberto a opinões de como declarar ela, estou deixando algumas como String,
deem uma olhada depois e se quiser façam alguma alteração,
porem deixe resgistrado aqui


<br>
<hr>
TABELA ATUAL DO MySQL:


/*
USE atmosfera;
SELECT * FROM atuadores;
SELECT * FROM dispositivos;
SELECT * FROM registro;

CREATE TABLE dispositivos(
id_dispositivos INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
nome_dispositivo VARCHAR(30) NOT NULL,
localizacao VARCHAR(50),
tipo_dispositivo VARCHAR(30) NOT NULL,
gatewai_pai_fk INT
);


CREATE TABLE registro(
id_registro BIGINT NOT NULL auto_increment PRIMARY KEY,
id_dispositivos_fk INT NOT NULL,
timestamp timestamp NOT NULL,
data_hora DATETIME default NOW(),
temperatura FLOAT,
umidade FLOAT,
pressao FLOAT,
altitude FLOAT,
luminosidade FLOAT,
velocidade_vento FLOAT,
direcao_vento INT,
intensidade_wifi FLOAT,
FOREIGN KEY (id_dispositivos_fk) REFERENCES dispositivos(id_dispositivos)
);


CREATE TABLE atuadores(
id_atuadores INT PRIMARY KEY auto_increment NOT NULL,
id_dispositivo_fk INT NOT NULL,
nome_atuador VARCHAR(30) NOT NULL,
status_atual BOOl NOT NULL,
ultimo_comando DATETIME default NOW(),
FOREIGN KEY (id_dispositivo_fk) REFERENCES dispositivos(id_dispositivos)
);

USE atmosfera;
ALTER TABLE registro
RENAME COLUMN  timestamp TO time_stamp;

*/
