# 🌎 Atmosfera 4.0 — Backend

## 📌 Sobre o projeto

O **Atmosfera 4.0** é um projeto acadêmico voltado ao monitoramento de condições atmosféricas por meio de dispositivos e sensores.

O sistema permite armazenar e consultar informações coletadas pelos dispositivos, como temperatura, umidade, pressão atmosférica, altitude, luminosidade e velocidade do vento.

O backend é responsável por realizar a comunicação com o banco de dados MySQL e disponibilizar os dados por meio de uma API HTTP para o frontend.

## 🚀 Tecnologias utilizadas

- **Java** — desenvolvimento do backend.
- **Gradle** — gerenciamento e compilação do projeto.
- **MySQL** — armazenamento dos dados.
- **JDBC** — comunicação com o banco de dados.
- **Gson** — conversão de objetos Java para JSON.
- **HTML, CSS e JavaScript** — desenvolvimento da interface.
- **Chart.js** — visualização de dados em gráficos.

## 📂 Estrutura do projeto

```text
Projeto-Atmosfera4.0-backend/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── org/example/
│       │       ├── Main.java
│       │       ├── Conexao.java
│       │       ├── DispositivosDAO.java
│       │       ├── RegistrosDAO.java
│       │       └── AtuadoresDAO.java
│       │
│       └── resources/
│           └── public/
│               ├── index.html
│               └── JS/
│                   ├── script.js
│                   └── historico.js
│
├── build.gradle
├── settings.gradle
└── README.md
```

## 🗄️ Banco de dados

O projeto utiliza o MySQL com um banco de dados chamado `atmosfera`.

As principais tabelas utilizadas são:

| Tabela | Finalidade |
|---|---|
| `dispositivos` | Armazenar informações dos dispositivos |
| `registro` | Armazenar os dados coletados pelos sensores |
| `atuadores` | Armazenar informações dos atuadores |

Os identificadores das tabelas são configurados para geração automática (`AUTO_INCREMENT`).

### Configuração da conexão

Antes de executar o projeto, é necessário:

1. Instalar e iniciar o MySQL.
2. Criar o banco de dados `atmosfera`.
3. Criar as tabelas necessárias conforme a estrutura SQL do projeto.
4. Conferir as configurações de conexão no arquivo `Conexao.java`.
5. Informar o endereço, a porta, o usuário e a senha do seu banco de dados.

**Importante:** não compartilhe senhas do banco de dados no GitHub.

## ⚙️ Como executar o projeto

### Pré-requisitos

- Java JDK instalado.
- MySQL instalado e em execução.
- IntelliJ IDEA ou outra IDE compatível com Java.
- Gradle (o projeto também possui o Gradle Wrapper).

### 1. Clonar o repositório

```bash
git clone https://github.com/LucasOCruz07/Projeto-Atmosfera4.0-backend.git
```

### 2. Entrar na pasta do projeto

```bash
cd Projeto-Atmosfera4.0-backend
```

### 3. Compilar o projeto

No Windows, execute:

```powershell
.\gradlew.bat build
```

### 4. Executar o backend

```powershell
.\gradlew.bat run
```

### 5. Acessar a aplicação

Com o servidor em execução, abra o navegador e acesse:

```text
http://localhost:8080
```

## 🔌 API HTTP

O backend disponibiliza rotas para trabalhar com dispositivos, registros e atuadores.

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/dispositivos` | Consultar dispositivos |
| POST | `/api/dispositivos` | Cadastrar dispositivos |
| GET | `/api/registros` | Consultar registros |
| POST | `/api/registros` | Cadastrar registros |
| GET | `/api/atuadores` | Consultar atuadores |
| POST | `/api/atuadores` | Cadastrar atuadores |

As respostas da API utilizam o formato JSON.

## 📊 Funcionalidades

- Cadastro e consulta de dispositivos.
- Armazenamento de registros dos sensores.
- Consulta de informações dos atuadores.
- Dashboard para visualização de informações.
- Gráficos para acompanhamento dos dados.
- Histórico de registros coletados.

## 👨‍💻 Equipe e desenvolvimento

Projeto desenvolvido com finalidade acadêmica, aplicando conhecimentos de programação Java, banco de dados, desenvolvimento web e integração entre frontend e backend.
