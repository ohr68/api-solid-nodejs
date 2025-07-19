import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import dotenv from 'dotenv'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()

    dotenv.config({ path: '.env.test' })
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'teste',
      email: 'teste@teste.com',
      password: '123455677',
    })

    expect(response.statusCode).toEqual(201)
  })
})
