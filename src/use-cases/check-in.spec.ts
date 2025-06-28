import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckinUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { randomUUID } from 'crypto'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckinUseCase
let gymId: string

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckinUseCase(checkInsRepository, gymsRepository)

    const gym = await gymsRepository.create({
      id: 'gym-01',
      title: 'teste',
      description: 'testando',
      phone: '',
      latitude: -20.8605094,
      longitude: -48.2896038,
    })

    gymId = gym.id

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId,
      userId: randomUUID(),
      userLatitude: -20.8605094,
      userLongitude: -48.2896038,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2025, 5, 27, 8, 0, 0))

    const userId = randomUUID()

    await sut.execute({
      gymId,
      userId,
      userLatitude: -20.8605094,
      userLongitude: -48.2896038,
    })

    await expect(() =>
      sut.execute({ gymId, userId, userLatitude: 0, userLongitude: 0 }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2025, 5, 27, 8, 0, 0))

    const userId = randomUUID()

    await sut.execute({
      gymId,
      userId,
      userLatitude: -20.8605094,
      userLongitude: -48.2896038,
    })

    vi.setSystemTime(new Date(2025, 5, 28, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId,
      userId,
      userLatitude: -20.8605094,
      userLongitude: -48.2896038,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    await expect(() =>
      sut.execute({
        gymId,
        userId: randomUUID(),
        userLatitude: -20.8805993,
        userLongitude: -48.3074995,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
