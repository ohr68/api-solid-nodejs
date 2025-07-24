import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import dotenv from 'dotenv'
import { createAndAuthenticateUser } from '@/tests/utils/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()

    dotenv.config({ path: '.env.test' })
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Teste',
        description: 'testando',
        phone: '11124345335',
        latitude: -20.8605094,
        longitude: -48.2896038,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Academia',
        description: 'testando',
        phone: '11124345335',
        latitude: -20.9340843,
        longitude: -48.4903992,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .set('Authorization', `Bearer ${token}`)
      .query({
        latitude: -20.9340843,
        longitude: -48.4903992,
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Academia',
      }),
    ])
  })
})
