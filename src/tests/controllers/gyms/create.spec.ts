import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import dotenv from 'dotenv'
import { createAndAuthenticateUser } from '@/tests/utils/create-and-authenticate-user'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()

    dotenv.config({ path: '.env.test' })
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const createResponse = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Teste',
        description: 'testando',
        phone: '11124345335',
        latitude: -20.8605094,
        longitude: -48.2896038,
      })

    expect(createResponse.statusCode).toEqual(201)
  })
})
