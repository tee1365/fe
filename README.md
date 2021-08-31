1. 写generics的方法

    ```ts
    const betterUpdateQuery = <Result, Query>(
      cache: Cache,
      qi: QueryInput,
      result: any,
      fn: (r: Result, q: Query) => Query
    ) => {};
    ```

    如果只有一个则后面要加逗号,不然在tsx文件里会报错

    ```ts
    const betterUpdateQuery = <Result,>(
      cache: Cache,
      qi: QueryInput,
      result: any,
      fn: (r: Result) => string
    ) => {};
    ```

2. ssr
  
  ```plain
  me -> browse localhost:3000 
  -> next.js server 
  -> request graphql server localhost:4000
  -> building the html
  -> sending back to your browser
  ```
