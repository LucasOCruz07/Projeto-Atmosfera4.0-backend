FALTA TERMINAR O TesteDAO, e FAZER a main
<br>
(USAR DE REFERENCIA projetos fullstack do Orrico)
<br>
<hr>


deixei em aberto a questao de algumas variaveis como:
"nome_atuador"
"ultimo_comando"

Pois estao dadas como varChar, datetime, timestamp..
Fico aberto a opinões de como declarar ela, estou deixando algumas como String,
deem uma olhada depois e se quiser façam alguma alteração,
porem deixe resgistrado aqui

<hr>
bem provavel ter que colocar as FK
Orrico disse que nao mas o projeto do marcus precisou
Segue as Orienteções: 

Table: atuadores


Table: registro
gatewai_pai_fk int


Table: registro
id_dispositivos_fk int 


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
time_stamp timestamp NOT NULL,
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

-----------------------------------
INSERT INTO registro (temperatura, umidade, pressao, altitude, luminosidade, velocidade_vento, intensidade_wifi) VALUES
( 24.5, 65.2, 1013.25, 750.0, 450.0, 12, -65),
( 28.1, 55.0, 1012.80, 752.3, 890.0, 22, -70),
( 24.8, 64.9, 1013.10, 750.0, 420.0, 10, -64);
select*from registro;

select*from Atuadores;

INSERT INTO Atuadores ( nome_atuador) VALUES
( 'Irrigador Automático Setor A'),
( 'Exaustor de Ar Traseiro'),
( 'Válvula de Pressão de Segurança');

INSERT INTO Dispositivos ( nome_dispositivo, localizacao, tipo_dispositivo, gatway_pai_fk) VALUES
( 'Sensor Estação Norte', 'Estufa 01', 'Estação Meteorológica', 100),
( 'Sensor Estação Sul', 'Campo Aberto', 'Estação Meteorológica', 100),
( 'Controlador Central', 'Laboratório', 'Painel de Controle', 101);

select*from   registro;
*/
