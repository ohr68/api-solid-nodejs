import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckinUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { randomUUID } from 'crypto'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckinUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckinUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: randomUUID(),
      userId: randomUUID(),
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2025, 5, 27, 8, 0, 0))

    const gymId = randomUUID()
    const userId = randomUUID()

    await sut.execute({
      gymId,
      userId,
    })

    await expect(() => sut.execute({ gymId, userId })).rejects.toBeInstanceOf(
      Error,
    )
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2025, 5, 27, 8, 0, 0))

    const gymId = randomUUID()
    const userId = randomUUID()

    await sut.execute({
      gymId,
      userId,
    })

    vi.setSystemTime(new Date(2025, 5, 28, 8, 0, 0))

    const { checkIn } = await sut.execute({ gymId, userId })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
