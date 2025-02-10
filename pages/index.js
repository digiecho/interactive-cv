// pages/index.js
import Link from 'next/link';

export default function Home({ quote, quoteError }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4">Stephen Foale</h1>
      <p className="text-lg mb-8">Interactive CV & Portfolio</p>
      {quote ? (
        <div className="bg-white shadow rounded p-4 mb-8">
          <p className="italic">"{quote.text}"</p>
          <p className="mt-2 text-right">- {quote.author || 'Unknown'}</p>
        </div>
      ) : quoteError ? (
        <p className="text-red-500 mb-8">{quoteError}</p>
      ) : (
        <p className="mb-8">Loading quote...</p>
      )}
      <nav className="space-x-4">
        <Link href="/cv">CV</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    // Fetch from ZenQuotes API
    const res = await fetch('https://zenquotes.io/api/random');
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const data = await res.json();
    // ZenQuotes returns an array; use the first element.
    const quoteData = data[0];
    return {
      props: {
        quote: { text: quoteData.q, author: quoteData.a },
      },
    };
  } catch (error) {
    console.error('Failed to fetch quote:', error);
    return {
      props: {
        quote: null,
        quoteError: 'Failed to fetch quote. Please try again later.',
      },
    };
  }
}
