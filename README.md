
# Graphql + Node Js + Mongodb CRUD API

  

## Intro

This is an simple TODO crud API using Graphql + Node Js + Mongodb (Using mongoose as ORM)

  

## Live URL
[Production Link](https://gql-node.herokuapp.com/graphql)
  

## How to use!

  

- create the files `env.development` for local & `.env.production` for production

- Set content as follows:

```sh

PORT=<PORT-NUMBER>

DB_URL=<MONGODB_URL>
```
GRAPHQl API's - ([live-url](https://gql-node.herokuapp.com/graphql))

1. Register (Create User)

```sh
    mutation {
    	  register(email: "techyaura@yopmail.com", password: "Hello@123"){
    	    message
    	  }
    }
```

2. Login (with registered User)

```sh
    query {
	  login(
	  email: "techyaura@yopmail.com", 
	  password: "Hello@123"){
	    message
	    token
	    user {
	      email
	      _id
	    }
	  }
	}
```

3. TODOS (create) - Authenticated Request(Must sent Authorization HEADER - format: `Authorization: Bearer <Token>`)

```sh
    mutation {
	  addTodo (title: "Hello World") {
	    message
    	ok
	  }
	}
```

4. TODOS (read) - UnAuthenticated

```sh
    query {
	  todoList {
	    message
    	ok
	  }
	}
```

5. TODOS (update) - Authenticated Request(Must sent Authorization HEADER - format: `Authorization: Bearer <Token>`)

```sh
    mutation {
	  updateTodo (_id: "<<TODO-ID>>", title: "Hello World - 2") {
	    message
    	ok
	  }
	}
```

6. TODOS (delete)  - Authenticated Request(Must sent Authorization HEADER - format: `Authorization: Bearer <Token>`)

```sh
    mutation {
	  deleteTodo(_id: "<TODO-ID>") {
	    message
    	ok
	  }
	}
```
