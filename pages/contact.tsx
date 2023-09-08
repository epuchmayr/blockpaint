import Link from 'next/link';
import { useRouter } from 'next/router'
import Button from '../components/Button';

export default function Contact() {
  const router = useRouter()
  return (
    <div>
    <Button type="button" onClick={() => router.back()}>
      Click here to go back
    </Button>
      <br />
      made by EAP!
    </div>
  );
}
