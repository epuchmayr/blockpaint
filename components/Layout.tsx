import Head from "next/head";
import Link from "next/link";
import styles from './Layout.module.scss';

export default function LayoutCreator({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className={styles.container}>
        <Head>
          <title>Blockpaint</title>
        </Head>
        <header className={styles.header}>
          <h1>Blockpaint</h1>
        </header>
        <main className={styles.main}>
          {children}
        </main>
        <footer className={styles.footer}>
          <Link href={'/contact'}>Contact</Link>
        </footer>
        <style jsx global>{`
            html,
            body {
            padding: 0;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
                Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
                sans-serif;
            }

            * {
            box-sizing: border-box;
            }

            button {
            cursor: pointer;
            }
        `}</style>
      </div>
    );
  }