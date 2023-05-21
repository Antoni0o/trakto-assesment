# Desafio Trakto -- Backend Developer

## Objetivo

Desenvolver uma API Rest com um único end-point utilizando o framework NestJS e MongoDB. Realizar a tarefa como descrito a seguir.

## Descrição

O end-point recebe uma url pública de uma imagem JPG, salva no sistema de arquivos e gera uma versão reduzida da imagem (acrescentando o sufixo \_thumb ao nome do arquivo), que tem sua maior dimensão com 720px e a dimensão menor proporcional. Caso a maior dimensão seja inferior a 720px, apenas uma cópia da imagem original é feita com o sufixo no nome do arquivo.

A imagem reduzida tem compactação e o fator é enviado como parâmentro junto com a url da imagem original (valor deve maior que 0 e menor que 1).

O serviço também registra numa instância do mongodb, todos os metadados contidos no exif da imagem original.

---

## Modelo de requisição

**URL:** `${BASE_URL}/image/save`  
**METHOD:** `POST`  
**BODY:**

```json
{
  "image": "https://assets.storage.trakto.io/AkpvCuxXGMf3npYXajyEZ8A2APn2/0e406885-9d03-4c72-bd92-c6411fbe5c49.jpeg",
  "compress": 0.9
}
```

---

## Modelo de resposta

### **SUCESSO**

**STATUS:** Padrão de status http

```json
{
  "localpath": {
    "original": "/path/to/original.jpg",
    "thumb": "/path/to/thumb.jpg"
  },
  "metadata": {
    "ALL_EXIF_DATA_KEY": "ALL_EXIF_DATA_VALUE"
  }
}
```

### **FALHA**

**STATUS:** Padrão de status http

```json
{
  "statusCode": NUMBER_STATUS_CODE,
  "message": "Error message"
}
```

## Como executar:

Para iniciar o projeto, instale as dependências:

```shell
npm install
```

Suba a instância do MongoDB do docker-compose:

```shell
docker-compose up -d
```

Rode o projeto Nest:

```shell
npm run start:dev
```

Acesse o endpoint exposto no localhost por uma plataforma de API (Postman ou Insomnia) utilizando a porta **3000**.
