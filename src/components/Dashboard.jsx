import { useRef, useState, useContext, useEffect } from "react";
import { AppContext } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function Dashboard() {
  const formRef = useRef(null);
  const { user } = useContext(AppContext);
  const [todoData, setTodoData] = useState({ task: "" });
  const [todo, setTodo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState();
  const [error, setError] = useState();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");
  const [editId, setEditId] = useState();
  const Navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (editId) {
        const url = `${API_URL}/api/todo/${editId}`;
        await axios.patch(url, todoData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setMessage("Todo updated successfully");
      } else {
        const url = `${API_URL}/api/todo/`;
        await axios.post(url, todoData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setMessage("Todo added successfully");
      }
      setTodoData({ task: "" });
      setEditId(null);
      fetchTodo();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Operation failed");
    }
    setLoading(false);
  };

  const fetchTodo = async () => {
    setError(null);
    try {
      const id = user.userId;
      const url = `${API_URL}/api/todo/${id}?status=${status}&page=${page}&limit=${limit}`;
      const result = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setTodo(result.data.todo);
      setTotalPages(result.data.totalPage);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Fetching Todo failed");
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const url = `${API_URL}/api/todo/${id}`;
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setMessage("Todo deleted successfully");
      fetchTodo();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message);
    }
    setLoading(false);
  };

  const handleUpdate = async (id, status) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const url = `${API_URL}/api/todo/${id}`;
      await axios.patch(
        url,
        { status },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setMessage("Updated status successfully");
      fetchTodo();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Updating status failed");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user?.token) {
      Navigate("/");
      return;
    }
    fetchTodo();
  }, [page, status]);
  return (
    <>
      <div className="dashboard-container">
        {error && <p className="error">{error}</p>}
        {message && <p className="msg">{message}</p>}
        <form
          className="form-display"
          ref={formRef}
          onSubmit={handleAddOrUpdate}
        >
          <input
            className="btn-input"
            type="text"
            placeholder="Enter Task Todo"
            value={todoData.task}
            onChange={(e) => setTodoData({ ...todoData, task: e.target.value })}
            required
          />

          {editId ? (
            <>
              <button className="update" type="submit" disabled={loading}>
                Update
              </button>
              <button
              className="cancel"
                type="button"
                disabled={loading}
                onClick={() => {
                  setEditId(null);
                  setTodoData({ task: "" });
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button className="btn-add" type="submit" disabled={loading}>
              +
            </button>
          )}
        </form>
        <h3>Filter by Status: </h3>
        <select
          className="select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        {todo.length === 0 ? (
          <p>No todos yet!</p>
        ) : (
          <div>
            {todo.map((value) => (
              <div className="todo-item" key={value._id}>
                <div className="todo-left">
                  {value.status === "pending" && (
                    <button
                      className="done"
                      disabled={loading}
                      onClick={() => handleUpdate(value._id, "completed")}
                    >
                      <i class="fa-solid fa-check"></i>
                    </button>
                  )}
                </div>

                <div className="todo-center"><span>{value.task}</span>
                <span className="status">{value.status}</span></div>

                <div className="todo-right">
                  {value.status !== "completed" && (
                    <button className="edit"
                      disabled={loading}
                      onClick={() => {
                        setEditId(value._id);
                        setTodoData({ task: value.task });
                      }}
                    >
                      <i class="fa-solid fa-pen"></i>
                    </button>
                  )}
                  <button
                    className="delete"
                    disabled={loading}
                    onClick={() => handleDelete(value._id)}
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {todo.length === 0 ? (
        ""
      ) : (
        <div className="pagination">
          <button className="prev" disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span className="page">{page} of {totalPages}</span>
          <button className="next"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
