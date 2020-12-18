

### Setup Instructions

To download this project:

```$ git clone https://github.com/bluchip6/blockchainconceptproject```

To install the dependencies (web3, express, etc):

```$npm install```

To run the code as a web server:

```$node handlers.js```

To curl (see-url) your webserver and get it to interact with Ethereum:

```curl -XGET http://localhost:8080/```

To curl a POST request to get it to execute a *transferFunds* call to your contract:

```curl -XPOST http://localhost:8080/transfer -H 'content-type: application/json' -d '{"account_from": "0x5Ec11AD6b8F0BBf5086E6eeA6295942A1F5d7119","account_to": "0x9Ca57f358dC7871C471714Aaa828fFE38f60b194","amount": "1000000000000"}'```



### Docker

To build a docker container from your Dockerfile (and .dockerignore) files (note by default it uses the file called Dockerfile)

```$docker build -t [user/tag] .```

Note the trailing . !

To validate that your docker image is available

```$docker images```

To see your running containers

```$docker ps ```

Finally, to run your docker container (validate it's running by seeing your running containers)

```$docker run -p 49160:8080 --name blockchainconceptproject  -d bluchip6/image1```




