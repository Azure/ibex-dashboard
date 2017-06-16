// todo: this could be extracted to a module shared between client and server

const typeDefs = `
type AIResponse {
  body: String
}

type Query {
  AI(query:String!,appId:String!,apiKey:String!): AIResponse
}
`;

module.exports = {
  typeDefs,
};