import React, { useState, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import Todo from "./components/Todo";

const style = {
	bg: `h-screen w-screen p-4 bg-gradient-to-r from-[#00AFB9] to-[#FED9B7]`,
	container: `bg-gradient-to-r from-[#00AFB9] to-[#FED9B7] max-w-[500px] w-full m-auto rounded-md shadow-xl p-4 `,
	heading: `text-3xl font-bold text-center text-gray-800 p-2`,
	form: `flex justify-between`,
	input: `border p-2 w-full text-xl`,
	button: `border p-4 ml-2 bg-gradient-to-r from-[#0081A7] to-[#00AFB9] rounded-md text-slate-100`,
	count: `text-center p-2 font-semibold`,
};

// let devAPIURL = "http://localhost:8080";

const App = () => {
	const [todos, setTodos] = useState([]);
	const [input, setInput] = useState("");

	//Read todos from Pocketbase
	async function getTodos() {
		try {
			const res = await fetch(`/todos`);
			const data = await res.json();
			let todos = data.items.map(t => {
				return {
					id: t.id,
					name: t.name,
					completed: t.completed
				}
			})
			setTodos(todos);
		}
		catch (err) {
			console.log(err);
		}
	}

	//Read todos on mount
	useEffect(() => {
		getTodos();
	}, []);

	//Create todo
	const createTodo = async (e) => {
		e.preventDefault(e);
		if (input === "") {
			alert("Please enter a todo name!");
			return;
		}
		const res = await fetch(`/create-todo`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name: input }),
		});

		setInput("");
		getTodos();
	};

	//toggle todo completeness
	const toggleComplete = async (todo) => {
		const res = await fetch(`toggle-todo`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id: todo.id, completed: !todo.completed }),
		});
		getTodos();
	};

	//delete todo
	const deleteTodo = async (id) => {
		const res = await fetch(`delete-todo`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id }),
		});
		getTodos();
	};

	//render contents
	return (
		<div className={style.bg}>
			<div className={style.container}>
				<h3 className={style.heading}>Todo List</h3>
				<form onSubmit={createTodo} className={style.form}>
					<input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						className={style.input}
						type="text"
						placeholder="Add your todo..."
					/>
					<button className={style.button}>
						<AiOutlinePlus size={30} />
					</button>
				</form>
				<ul>
					{todos.map((todo) => (
						<Todo
							key={todo.id}
							todo={todo}
							toggleComplete={toggleComplete}
							deleteTodo={deleteTodo}
						/>
					))}
				</ul>

				{todos.length < 1 ? null : (
					<p className={style.count}>{`You have ${todos.length} todos`}</p>
				)}
			</div>
		</div>
	);
};

export default App;
