import Navbar from '../components/Navbar';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Navbar />
      <div className="p-4">
        <Component {...pageProps} />
      </div>
    </div>
  );
}