package org.example;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;


public class Main {


    private static final int PORTA = 8080;
    private static final Gson GSON = new Gson();
    private static final AtuadoresDAO ATUADORES_DAO = new AtuadoresDAO();
    private static final DispositivosDAO DISPOSITIVOS_DAO = new DispositivosDAO();
    private static final RegistrosDAO REGISTROS_DAO = new RegistrosDAO();



    public static void main(String[] args) throws IOException {

        HttpServer servidor = HttpServer.create(new InetSocketAddress("0.0.0.0", PORTA), 0);
        servidor.createContext("/api/atuadores", Main::atenderAtuadores);
        servidor.createContext("/api/dispositivos", Main::atenderDispositivos);
        servidor.createContext("/api/registros", Main::atenderRegistros);

        servidor.createContext("/", Main::abrirPagina);

        servidor.start();
        System.out.println("Servidor rodando em http://localhost:" + PORTA);

        /*teste de conexao com o MySQL
        Conexao.testar();*/





        /*
        AtuadoresDAO atuadoresDAO = new AtuadoresDAO();
        DispositivosDAO dispositivosDAO = new DispositivosDAO();
        RegistrosDAO registrosDAO = new RegistrosDAO();


        atuadoresDAO.salvarAtua(new Atuadores(0, 1, "rafamelo", false,LocalDateTime.now() ));
        dispositivosDAO.salvarDisp(new Dispositivo(0,"marcusVini", "Pirituba","tipoé", 1 ));
        registrosDAO.salvarRegis(new Registros(0L, 1, "2026-10-28_09-59-00", LocalDateTime.now(), 38.0f, 40.0f, 60.0f, 50.0f, 45.0f, 40.0f, 10, 34.8f));


        atuadoresDAO.listarAtuaDisponiveies();
        dispositivosDAO.listarDispDisponiveies();
        registrosDAO.listarRegis_Disponiveies();
        */

    }

    private static void atenderAtuadores(HttpExchange troca) throws IOException{
        configurarCors(troca);
        try {
            if(troca.getRequestMethod().equals("OPTIONS")) {
                troca.sendResponseHeaders(204, -1);
            } else if (troca.getRequestMethod().equals("GET")) {
                List<Atuadores> lista = ATUADORES_DAO.listarAtuaDisponiveies();
                responder(troca, 200, GSON.toJson(lista));
            } else if (troca.getRequestMethod().equals("POST")) {
                String corpo = new String(troca.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                Atuadores novo = GSON.fromJson(corpo, Atuadores.class);

                ATUADORES_DAO.salvarAtua(novo);
                responder(troca, 201, "{\"mensagem\":\"Atuador cadastrado com sucesso!\"}");

            } else {
                responder(troca, 405, "{\"erro\":\"Método não permitido\"}");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            responder(troca, 500, "{\"erro\":\"Erro no banco de dados\"}");
        }
    }

    private static void atenderDispositivos (HttpExchange troca) throws IOException {
        configurarCors(troca);
        try {
            if (troca.getRequestMethod().equals("OPTIONS")) {
                troca.sendResponseHeaders(204, -1);
            } else if (troca.getRequestMethod().equals("GET")) {
                List <Dispositivo> lista = DISPOSITIVOS_DAO.listarDispDisponiveies();
                responder(troca, 200, GSON.toJson(lista));
            } else if (troca.getRequestMethod().equals("POST")) {
                String corpo = new String(troca.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                Dispositivo novo = GSON.fromJson(corpo, Dispositivo.class);

                DISPOSITIVOS_DAO.salvarDisp(novo);
                responder(troca, 201, "{\"mensagem\":\"Dispositivo cadastrado com sucesso!\"}");
            } else {
                responder(troca, 405, "{\"erro\":\"Método não permitido\"}");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            responder(troca, 500, "{\"erro\":\"Erro no banco de dados\"}");
        }
    }

    private static void atenderRegistros(HttpExchange troca) throws IOException {
        configurarCors(troca);
        try {
            if (troca.getRequestMethod().equals("OPTIONS")) {
                troca.sendResponseHeaders(204, -1);
            } else if (troca.getRequestMethod().equals("GET")) {
                List<Registros> lista = REGISTROS_DAO.listarRegis_Disponiveies();
                responder(troca, 200, GSON.toJson(lista));
            } else if (troca.getRequestMethod().equals("POST")) {
                String corpo = new String(troca.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                Registros novo = GSON.fromJson(corpo,Registros.class);

                REGISTROS_DAO.salvarRegis(novo);
                responder(troca, 201, "{\"mensagem\":\"Registro salvo com sucesso!\"}");
            } else {
                responder(troca,405,"{\"erro\":\"Método não permitido\"}");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            responder(troca,500,"{\"erro\":\"Erro no banco de dados\"}");
        }
    }

    private static void configurarCors(HttpExchange troca) {
        troca.getResponseHeaders().set("Acess-Control-Allow-Origin", "*");
        troca.getResponseHeaders().set("Acess-Control-Allow-Methods", "GET, POST, OPTIONS");
        troca.getResponseHeaders().set("Acess-Control-Allow-Headers", "Content-Type");
    }

    private static void responder (HttpExchange troca, int status, String conteudo) throws IOException {
        byte[] resposta = conteudo.getBytes(StandardCharsets.UTF_8);
        troca.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        troca.sendResponseHeaders(status,resposta.length);
        troca.getResponseBody().write(resposta);
        troca.close();
    }


    private static void abrirPagina(HttpExchange troca) throws IOException {
        if (!troca.getRequestMethod().equals("GET")) {
            responderTexto(troca, 405, "Método não permitido", "text/plain");
            return;
        }

        String caminho = troca.getRequestURI().getPath();

        if (caminho.equals("/")) {
            caminho = "/index.html";
        }

        // Evita tentativas de acessar arquivos fora da pasta pública
        if (caminho.contains("..") || caminho.contains("\\")) {
            responderTexto(troca, 400, "Caminho inválido", "text/plain");
            return;
        }

        // Os arquivos estão em src/main/resources/public/
        String recurso = "/public" + caminho;

        try (InputStream arquivo = Main.class.getResourceAsStream(recurso)) {
            if (arquivo == null) {
                responderTexto(
                        troca, 404,
                        "Arquivo não encontrado: " + caminho,
                        "text/plain"
                );
                return;
            }

            String tipo;

            if (caminho.endsWith(".html")) {
                tipo = "text/html";
            } else if (caminho.endsWith(".css")) {
                tipo = "text/css";
            } else if (caminho.endsWith(".js")) {
                tipo = "application/javascript";
            } else {
                tipo = "application/octet-stream";
            }

            byte[] conteudo = arquivo.readAllBytes();

            troca.getResponseHeaders().set(
                    "Content-Type", tipo + "; charset=UTF-8"
            );
            troca.sendResponseHeaders(200, conteudo.length);
            troca.getResponseBody().write(conteudo);
            troca.close();
        }
    }


    private static void responderTexto(HttpExchange troca, int status, String conteudo, String tipo) throws IOException {
        byte [] resposta = conteudo.getBytes(StandardCharsets.UTF_8);
        troca.getResponseHeaders().set("Content-Type", tipo + "; charset=UTF-8");
        troca.sendResponseHeaders(status, resposta.length);
        troca.getResponseBody().write(resposta);
        troca.close();
    }
}