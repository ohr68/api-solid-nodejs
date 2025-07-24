import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    name: 'teste',
    email: 'teste@teste.com',
    password: '123455677',
  })

  const auhtResponse = await request(app.server).post('/sessions').send({
    email: 'teste@teste.com',
    password: '123455677',
  })

  const { token } = auhtResponse.body

  return { token }
}
