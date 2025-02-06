import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    async function fetchQuote() {
      const res = await fetch('https://type.fit/api/quotes');
      const data = await res.json();
      const randomQuote = data[Math.floor(Math.random() * data.length)];
      setQuote(randomQuote);
    }
    fetchQuote();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4">Stephen Foale</h1>
      <p className="text-lg mb-8">Interactive CV & Portfolio</p>
      {quote && (
        <div className="bg-white shadow rounded p-4 mb-8 animate-fade-in">
          <p className="italic">"{quote.text}"</p>
          <p className="mt-2 text-right">- {quote.author || "Unknown"}</p>
        </div>
      )}
      <nav className="space-x-4">
        <Link href="/cv">
          <a className="text-blue-500 hover:underline">CV</a>
        </Link>
        <Link href="/contact">
          <a className="text-blue-500 hover:underline">Contact</a>
        </Link>
      </nav>
    </div>
  );
}
