import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import dotenv from 'dotenv'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()

    dotenv.config({ path: '.env.test' })
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
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

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'teste@teste.com',
      }),
    )
  })
})
