import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    try {
        await prisma.$connect();
        return Response.json({ success: true, message: 'DB Connected!' });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
})
