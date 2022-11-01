import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'John Snow',
      email: 'john.snow@gmail.com',
      avatarUrl: 'https://th.bing.com/th/id/OIP.5iQhybpa63ZBY6rM1kqVgwHaH7?w=183&h=196&c=7&r=0&o=5&dpr=1.3&pid=1.7'
    }
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Exampled Pool',
      code: 'BOL001',
      ownerId: user.id,

      // This is a chained relation with participants
      participants: {
        create: {
          userId: user.id
        }
      }
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-20T16:00:00.356Z',
      firstTeamCountryCode: 'QA',
      secondTeamCountryCode: 'EC',
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-21T13:00:00.356Z',
      firstTeamCountryCode: 'EN',
      secondTeamCountryCode: 'IR',

      guesses: {
        create: {
          firstTeamPoints: 3,
          secondTeamPoints: 0,
          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id
              }
            }
          }
        }
      }
    }
  })
}

main()