import Link from 'next/link';
import { useRouter } from 'next/router'
import Button from '../components/Button';

export default function Contact() {
  const router = useRouter()
  return (
    <div className='p-5'>
    <Button type="button" onClick={() => router.back()}>
      Click here to go back
    </Button>
    <br />
    Technologies:
    <ul>
      <li>React</li>
      <li>Typescript</li>
      <li>Tailwind</li>
      <li>SCSS</li>
      <li>Konva</li>
      <li>Canvas</li>
      <li>Nextjs</li>
      <li>Vercel</li>
      <li>Github</li>
    </ul>
      <br />
      <a href="https://github.com/epuchmayr/blockpaint" target='blank'>https://github.com/epuchmayr/blockpaint</a><br />
      made by EAP!
    </div>
  );
}
