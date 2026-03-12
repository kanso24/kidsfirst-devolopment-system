import { PrismaClient } from '@prisma/client'

const config = useRuntimeConfig()

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: config.databaseUrl
    }
  }
})

export default prisma
