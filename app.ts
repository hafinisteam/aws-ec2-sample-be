import express from 'express'
import { DataSource } from 'typeorm'
import cors from 'cors'
import { User } from './src/entities/User'

const app = express()
const PORT = 3001

app.use(express.json())

app.use(cors())

const connection = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'postgres',
  entities: [User],
  synchronize: true,
})

// TypeORM configuration
connection
  .initialize()
  .then(() => {
    console.log('Connected to the database')
  })
  .catch((error) => console.log('TypeORM connection error: ', error))

// User API routes
app.get('/api/users', async (req, res) => {
  const userRepository = connection.getRepository(User)
  const users = await userRepository.find()
  res.json(users)
})

app.post('/api/users', async (req, res) => {
  const { username } = req.body
  const userRepository = connection.getRepository(User)
  const user = new User()
  user.username = username
  await userRepository.save(user)
  res.json(user)
})

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params
  const userRepository = connection.getRepository(User)
  const user = await userRepository.findOne({ where: { id } })
  await userRepository.remove(user!)
  res.json({ message: 'User deleted' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}, with AWS EC2 and automatic deployment`)
})
