export const todoPath = 'todo'

export const todoMethods = ['find', 'get', 'create', 'patch', 'remove']

export const todoClient = (client) => {
  const connection = client.get('connection')

  client.use(todoPath, connection.service(todoPath), {
    methods: todoMethods
  })
}
