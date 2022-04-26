import fastifyAuth from "fastify-auth";
import { registration } from '../controller/authController';

export default async(fastify) => {
  return fastify.register(fastifyAuth)
    .after(() => {
      fastify.post('/register', registration(_req, reply))
    })

}
