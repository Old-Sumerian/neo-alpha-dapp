const { ChunkParser, ChunkType } = require("grpc-web-client/dist/ChunkParser") 

export function grpcJSONRequest(host, packageName, serviceName, methodName, requestHeaders, requestObject) {
  const serv