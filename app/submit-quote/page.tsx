"use client";
import { useState } from "react";
import Nav from "../Nav";
import "./submit-page.css";

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

  // "Where you read it" — collected in the UI only; the API doesn't store it yet
  const [source, setSource] = useState("");

  return (
    <div className="submit">
      <Nav />

      <main className="submit__main">
        <form
          className="submit__form"
          onSubmit={(e) => {
            e.preventDefault();
            submitQuote();
          }}
        >
          <textarea
            className="submit__quote"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type the quote."
            aria-label="The quote"
            rows={3}
          />

          <div className="submit__fields">
            <label className="submit__field">
              <span className="submit__label">Who said it</span>
              <input
                className="submit__input"
                value={author}
                onChange={e => setAuthor(e.target.value)}
              />
            </label>

           
          </div>

          <div className="submit__actions">
            <button type="submit" className="submit__button">Send</button>
            {message && <p className="submit__message">{message}</p>}
          </div>
        </form>
      </main>
    </div>
  );
}
