import Link from 'next/link';
import styles from './NextLink.styles.module.scss';

type Variant = 'default' | 'warning' | 'success' | 'danger';

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function NextLink({
  href,
  buttonText,
  variant = 'default',
  children,
}: {
  href: string;
  buttonText?: String;
  variant?: Variant;
  children?: any;
}) {
  let colors = 'bg-slate-300 border-slate-600';

  switch (variant) {
    case 'warning':
      colors = 'bg-yellow-300 border-yellow-600';
      break;
    case 'success':
      colors = 'bg-green-300 border-green-600';
      break;
    case 'danger':
      colors = 'bg-red-300 border-red-600';
      break;
      break;
    default:
      break;
  }
  return (
    <>
      <Link
        className={`${styles.buttonStyles} ${colors}`}
        href={href}
        as={href}
      >
        {buttonText}
      </Link>
    </>
  );
}
