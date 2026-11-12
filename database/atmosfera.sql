-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: atmosfera
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `atuadores`
--

DROP TABLE IF EXISTS `atuadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `atuadores` (
  `id_atuadores` int NOT NULL AUTO_INCREMENT,
  `id_dispositivos_fk` int NOT NULL,
  `nome_atuador` varchar(60) NOT NULL,
  `status_atual` tinyint(1) NOT NULL DEFAULT '0',
  `ultimo_comando` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_atuadores`),
  KEY `id_dispositivos_fk` (`id_dispositivos_fk`),
  CONSTRAINT `atuadores_ibfk_1` FOREIGN KEY (`id_dispositivos_fk`) REFERENCES `dispositivos` (`id_dispositivos`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `atuadores`
--

LOCK TABLES `atuadores` WRITE;
/*!40000 ALTER TABLE `atuadores` DISABLE KEYS */;
INSERT INTO `atuadores` VALUES (4,3,'Irrigador Automático Setor A',1,'2026-10-30 18:00:20'),(5,3,'Exaustor de Ar Traseiro',0,'2026-10-30 18:00:20'),(6,3,'Válvula de Pressão de Segurança',1,'2026-10-30 18:00:20'),(7,3,'Pc gamer',1,'2026-10-30 19:01:40'),(8,3,'Climatização HVAC-GIN',1,'2026-11-11 23:30:24'),(9,3,'Ventilação forçada VNT-A04',0,'2026-11-11 23:15:48'),(10,3,'Iluminação ILU-BIB',1,'2026-11-11 23:15:48'),(11,3,'Exaustores EST-REF',0,'2026-11-11 23:15:48'),(12,3,'Extração de ar VNT-REF',1,'2026-11-11 23:15:48');
/*!40000 ALTER TABLE `atuadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dispositivos`
--

DROP TABLE IF EXISTS `dispositivos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dispositivos` (
  `id_dispositivos` int NOT NULL AUTO_INCREMENT,
  `nome_dispositivo` varchar(30) NOT NULL,
  `localizacao` varchar(50) DEFAULT NULL,
  `tipo_dispositivo` varchar(30) NOT NULL,
  `gatewai_pai_fk` int DEFAULT NULL,
  PRIMARY KEY (`id_dispositivos`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dispositivos`
--

LOCK TABLES `dispositivos` WRITE;
/*!40000 ALTER TABLE `dispositivos` DISABLE KEYS */;
INSERT INTO `dispositivos` VALUES (1,'Sensor Estação Norte','Estufa 01','Estação Meteorológica',100),(2,'Sensor Estação Sul','Campo Aberto','Estação Meteorológica',100),(3,'Controlador Central','Laboratório','Painel de Controle',101),(4,'Sensor Estação Leste','Estufa 06','Estação Ciderurgica',102),(5,'Sensor Teste Histórico','Laboratório de Tecnologia','Sensor Inteligente',3);
/*!40000 ALTER TABLE `dispositivos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historico_atuadores`
--

DROP TABLE IF EXISTS `historico_atuadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historico_atuadores` (
  `id_historico` int NOT NULL AUTO_INCREMENT,
  `id_atuadores_fk` int NOT NULL,
  `status_novo` tinyint(1) NOT NULL,
  `data_hora` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_historico`),
  KEY `fk_historico_atuadores` (`id_atuadores_fk`),
  CONSTRAINT `fk_historico_atuadores` FOREIGN KEY (`id_atuadores_fk`) REFERENCES `atuadores` (`id_atuadores`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historico_atuadores`
--

LOCK TABLES `historico_atuadores` WRITE;
/*!40000 ALTER TABLE `historico_atuadores` DISABLE KEYS */;
INSERT INTO `historico_atuadores` VALUES (1,8,0,'2026-11-11 23:30:23'),(2,8,1,'2026-11-11 23:30:24');
/*!40000 ALTER TABLE `historico_atuadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historico_dispositivos`
--

DROP TABLE IF EXISTS `historico_dispositivos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historico_dispositivos` (
  `id_historico` int NOT NULL AUTO_INCREMENT,
  `id_dispositivos_fk` int NOT NULL,
  `nome_dispositivo` varchar(150) NOT NULL,
  `acao` varchar(30) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `data_hora` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_historico`),
  KEY `fk_historico_dispositivos` (`id_dispositivos_fk`),
  CONSTRAINT `fk_historico_dispositivos` FOREIGN KEY (`id_dispositivos_fk`) REFERENCES `dispositivos` (`id_dispositivos`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historico_dispositivos`
--

LOCK TABLES `historico_dispositivos` WRITE;
/*!40000 ALTER TABLE `historico_dispositivos` DISABLE KEYS */;
INSERT INTO `historico_dispositivos` VALUES (1,5,'Sensor Teste Histórico','CADASTRO','Dispositivo cadastrado em Laboratório','2026-11-12 00:09:33'),(2,5,'Sensor Teste Histórico','ALTERACAO','Dispositivo atualizado. Localização: Laboratório de Testes','2026-11-12 00:23:53'),(3,5,'Sensor Teste Histórico','ALTERACAO','Dispositivo atualizado. Localização: Laboratório Atualizado','2026-11-12 00:38:27'),(4,5,'Sensor Teste Histórico','ALTERACAO','Dispositivo atualizado. Localização: Laboratório Principal','2026-11-12 00:54:14'),(5,5,'Sensor Teste Histórico','ALTERACAO','Localização: Laboratório Principal → Laboratório de Tecnologia; Tipo: Sensor Ambiental → Sensor Inteligente','2026-11-12 01:10:14');
/*!40000 ALTER TABLE `historico_dispositivos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registro`
--

DROP TABLE IF EXISTS `registro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registro` (
  `id_registro` bigint NOT NULL AUTO_INCREMENT,
  `id_dispositivos_fk` int NOT NULL,
  `time_stamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_hora` datetime DEFAULT CURRENT_TIMESTAMP,
  `temperatura` float DEFAULT NULL,
  `umidade` float DEFAULT NULL,
  `pressao` float DEFAULT NULL,
  `altitude` float DEFAULT NULL,
  `luminosidade` float DEFAULT NULL,
  `velocidade_vento` float DEFAULT NULL,
  `direcao_vento` int DEFAULT NULL,
  `intensidade_wifi` float DEFAULT NULL,
  PRIMARY KEY (`id_registro`),
  KEY `id_dispositivos_fk` (`id_dispositivos_fk`),
  CONSTRAINT `registro_ibfk_1` FOREIGN KEY (`id_dispositivos_fk`) REFERENCES `dispositivos` (`id_dispositivos`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registro`
--

LOCK TABLES `registro` WRITE;
/*!40000 ALTER TABLE `registro` DISABLE KEYS */;
INSERT INTO `registro` VALUES (1,1,'2026-10-30 20:59:29','2026-10-30 17:59:29',24.5,65.2,1013.25,750,450,12,NULL,-65),(2,1,'2026-10-30 20:59:29','2026-10-30 17:59:29',28.1,55,1012.8,752.3,890,22,NULL,-70),(3,2,'2026-10-30 20:59:29','2026-10-30 17:59:29',24.8,64.9,1013.1,750,420,10,NULL,-64),(4,3,'2026-10-30 22:01:40','2026-10-30 19:01:40',30,67.2,1010.25,710,430,23,NULL,-67),(5,1,'2026-11-12 04:01:50','2026-11-12 01:01:50',24.5,55,NULL,NULL,NULL,NULL,NULL,NULL),(6,1,'2026-11-12 03:31:50','2026-11-12 00:31:50',25.2,58,NULL,NULL,NULL,NULL,NULL,NULL),(7,1,'2026-11-12 01:21:50','2026-11-11 22:21:50',26.1,62,NULL,NULL,NULL,NULL,NULL,NULL),(8,1,'2026-11-11 23:21:50','2026-11-11 20:21:50',27.3,60,NULL,NULL,NULL,NULL,NULL,NULL),(9,1,'2026-11-11 16:21:50','2026-11-11 13:21:50',23.8,54,NULL,NULL,NULL,NULL,NULL,NULL),(10,1,'2026-11-11 08:21:50','2026-11-11 05:21:50',22.5,52,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `registro` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-12  1:38:45
