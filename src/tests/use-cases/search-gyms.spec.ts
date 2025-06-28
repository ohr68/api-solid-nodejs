import { expect, describe, it, beforeEach } from 'vitest'
import { SearchGymsUseCase } from '@/use-cases/search-gyms'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'teste',
      description: null,
      phone: null,
      latitude: -20.8605094,
      longitude: -48.2896038,
    })

    await gymsRepository.create({
      title: 'js',
      description: null,
      phone: null,
      latitude: -20.8605094,
      longitude: -48.2896038,
    })

    const { gyms } = await sut.execute({
      query: 'teste',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'teste' })])
  })

  it('should be able to fetch paginated paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `teste ${i}`,
        description: null,
        phone: null,
        latitude: -20.8605094,
        longitude: -48.2896038,
      })
    }

    const { gyms } = await sut.execute({
      query: 'teste',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'teste 21' }),
      expect.objectContaining({ title: 'teste 22' }),
    ])
  })
})
