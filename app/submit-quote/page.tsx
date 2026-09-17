"use client";
import { useState } from "react";

export default function SubmitPage() {


  const [text, setText] = useState("");
  const [author, setAuthor]=useState("")

  const [message, setMessage]= useState("")

  async function submitQuote() {

    const response = await fetch("/api/quotes", {
  method: "POST",
  headers: {    "Content-Type": "application/json",},
  body: JSON.stringify({ text, author }),
});


  const data = await response.json();
    

  if(!response.ok){
    setMessage(data.error);
      return;
  }

  setMessage("Thanks — submitted for review.")
  setText("");
  setAuthor("");

  }

  

  return (
    <div>
      <h1>Submit a quote</h1>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="The quote"
      />

      <input
        value={author}
        onChange={e => setAuthor(e.target.value)}
        placeholder="Who said it"
      />

  

      <button onClick={submitQuote}>Submit</button>

      {message && <p>{message}</p>}
    </div>
  );
}