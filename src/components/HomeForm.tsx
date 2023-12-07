"use client";
import { type FormEvent, useState } from "react";

export default function HomeForm() {
  const [longUrl, setLongUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    // console.log(longUrl);
    const res = await fetch("/api/shortUrl", {
      method: "POST",
      body: JSON.stringify({
        original_url: longUrl,
      }),
    });
    if (res.status === 201) {
      setIsLoading(false);
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Long url"
          required
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
        />
        <button disabled={isLoading}>submit</button>
      </form>
    </div>
  );
}
