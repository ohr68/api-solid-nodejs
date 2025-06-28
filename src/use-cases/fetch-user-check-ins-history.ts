import { CheckIn } from 'generated/prisma'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface FechUserCheckInsHistoryUseCaseRequest {
  userId: string
  page: number
}

interface FechUserCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[]
}

export class FechUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FechUserCheckInsHistoryUseCaseRequest): Promise<FechUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    return { checkIns }
  }
}
