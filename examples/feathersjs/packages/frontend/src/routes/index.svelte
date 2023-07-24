<script>
  import { todos } from "@/stores/todo";

  let inputText = "";

  const handleToggle = (event) => {
    todos.updateStatus(event.target.value, event.target.checked);
  };
  const handleSubmit = () => {
    if (inputText) todos.add(inputText);
    inputText = "";
  };
</script>

<div class="todos">
  {#each $todos.data as todo (todo.id)}
    <div>
      <span class="text">{todo.text}</span>
      <input type="checkbox" value={todo.id} checked={todo.done} on:change={handleToggle} />
      <button on:click={() => todos.delete(todo.id)}>Delete</button>
    </div>
  {/each}
  <form on:submit|preventDefault={handleSubmit}>
    <input type="text" bind:value={inputText} placeholder="Water the cat" />
    <input type="submit" value="add todo" disabled={!inputText} />
  </form>
</div>

<style>
  .todos {
    font-family: Arial, sans-serif;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
  }
  .todos div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  .todos .text {
    flex-grow: 1;
    padding-right: 10px;
  }
  .todos input[type="checkbox"] {
    margin-right: 10px;
  }
  .todos input[type="submit"] {
    background-color: #008cba; /* Teal */
    color: white;
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  .todos button {
    background-color: #ff0000;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
  }
  .todos input[type="submit"]:disabled {
    background-color: #e0e0e0; /* Light grey */
    color: #808080; /* Grey */
    cursor: not-allowed;
}
  .todos button:hover {
    background-color: #cc0000;
  }
  .todos form {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    margin-top: 20px;
  }
  .todos form input[type="text"] {
    flex-grow: 1;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 5px;
    margin-right: 10px;
  }
</style>
