import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJwt {
    user: {
      sub: string
    }
  }
}
