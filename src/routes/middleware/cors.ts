import { FastifyReply, FastifyRequest } from "fastify"

export default async (req: FastifyRequest<{ Body: any, Params: any }>, res: FastifyReply) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
}
