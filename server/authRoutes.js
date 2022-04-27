import fastifyAuth from "fastify-auth";
import { registration } from '../controller/authController';

export default (fastify) => {
  fastify.register(fastifyAuth)
    .after(() => {
      fastify.post('/registration', async (_req, reply) => {
        await registration(_req.body, reply)
      })
    })
  return fastify

}
