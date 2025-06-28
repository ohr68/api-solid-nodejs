import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FechUserCheckInsHistoryUseCase } from '@/use-cases/fetch-user-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let sut: FechUserCheckInsHistoryUseCase

describe('Fetch User Check-in History Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FechUserCheckInsHistoryUseCase(checkInsRepository)
  })

  it('should be able to fetch check-in history', async () => {
    const userId = 'user-01'

    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: userId,
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: userId,
    })

    const { checkIns } = await sut.execute({
      userId,
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    const userId = 'user-01'

    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: userId,
      })
    }

    const { checkIns } = await sut.execute({
      userId,
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})
