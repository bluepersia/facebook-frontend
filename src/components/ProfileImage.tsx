import { getUserImage } from '../util/url';
import styles from './ProfileImage.module.css';

export enum Size {
  small,
  medium,
  large,
}
export default function ProfileImg({
  url,
  size,
  className = '',
}: {
  url: string;
  size: Size;
  className?: string;
}): JSX.Element {
  return (
    <img
      src={getUserImage(url).replace('<SIZE>', Size[size])}
      className={
        className + ' ' + styles.img + ' ' + styles[`img-${Size[size]}`]
      }
    />
  );
}
