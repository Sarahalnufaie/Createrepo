import React, {
  useState,
  useEffect,
  useRef,
  MutableRefObject,
  ChangeEvent,
} from "react";
import axios from "axios";
import { Button, FormCheck, Table, Form } from "react-bootstrap";


interface TodoItem {
  id: number;
  todo: string;
  completed: boolean;
}

const TodoApp = () => {
  const [todo, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  // get
  const getAll = () => {
    axios
      .get("https://65dc20793ea883a15292888b.mockapi.io/Todo")
      .then((response) => {
        setTodos(response.data);
        console.log(response.data);
      })
      .catch((error) => console.error("Error fetching todos:", error));
  };
  useEffect(() => {
    getAll();
  }, []);

  // post
  const createTodo = async () => {
    const response = await axios
      .post<TodoItem>("https://65dc20793ea883a15292888b.mockapi.io/Todo", {
        todo: newTodo,
        completed: false,
      })
      .then((response) => setTodos([response.data, ...todo]))
      .catch((error) => {
        alert("Something wrong, Please try again");
      });
  };

  // upduated
  const updateTodo = async (value:boolean,id: number) => { 
    const data = {completed:value}
    const response = await axios
      .put(`https://65dc20793ea883a15292888b.mockapi.io/Todo/${id}`,data)
      .then((res) => getAll());
  };

  //delete
  const deleteTodo = async (id: number) => {
    await axios.delete(
      `https://65dc20793ea883a15292888b.mockapi.io/Todo/${id}`
    );
    setTodos(todo.filter((todo) => todo.id !== id));
  };

  const handleUpdate = (id:number)=>{
  setTodos((prevItems)=> prevItems.map(
    (item:TodoItem)=>item.id === id ? {...item,completed:!item.completed} : item
  ))
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center bg-ligh">
      <h3>Todo</h3>
      <div>
      <Form.Control
      onChange={handleChange} placeholder="create a new todo..." />
        </div>
        <br/>
        <div>
        <Button variant="outline-secondary" onClick={() => createTodo()}>Add</Button>
      </div>
      <br/>
      <Table className="table table-striped">
        <thead>
          <tr>
            <th>Todos ID</th>
            <th>Todos todo</th>
            <th> completed</th>
            <th>Actions</th>
          </tr>
        </thead>
     <tbody>
        {todo.map((TodoItem) => {
          return (
            <tr  key={TodoItem.id}>
              <th>{TodoItem.id}</th>
              <th>{TodoItem.todo}</th>
              <th>
                <FormCheck 
                onChange= {(e)=> {
                  handleUpdate(TodoItem.id)
                  updateTodo(e.target.checked,TodoItem.id)
                }}
                //  onChange={(e) => console.log(e.target.checked)}
                checked={TodoItem.completed}
                // onChange={handleCheckboxChange}
                // onChange={() => onToggle(handleCheckboxChange)}
                 />
              </th>
              <th>
                {/* <Button variant="outline-info" onClick={() => updateTodo(TodoItem.id)}>updated</Button> */}
                <Button variant="outline-danger" onClick={() => deleteTodo(TodoItem.id)}>Delete</Button>
              </th>
            </tr>
          );
        })}
        </tbody>
 </Table>
    </div>
  );
};

export default TodoApp;
