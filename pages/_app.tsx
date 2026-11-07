import type { AppProps } from 'next/app';
import './input.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
