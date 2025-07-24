import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  await prisma.user.create({
    data: {
      name: 'teste',
      email: 'teste@teste.com',
      password_hash: await hash('123456', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const auhtResponse = await request(app.server).post('/sessions').send({
    email: 'teste@teste.com',
    password: '123456',
  })

  const { token } = auhtResponse.body

  return { token }
}
