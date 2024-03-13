import { useEffect } from 'react';
import useFetch, { State } from '../hooks/useFetch';
import { apiUrl } from '../util/url';
import styles from './LikesCounter.module.css';
import { ILikeable } from '../models/likeable';

export default function LikesCounter({
  target,
  invalidate,
}: {
  target: ILikeable;
  invalidate: (target: ILikeable) => void;
}): JSX.Element {
  const { refetch, state } = useFetch();

  useEffect(() => {
    if (state === State.Success) invalidate(target);
  }, [state]);

  function handleClick(): void {
    refetch(`${apiUrl}/reactions/toggle`, {
      method: 'POST',
      body: JSON.stringify({
        target: target.type,
        targetId: target._id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return (
    <div
      onClick={handleClick}
      className={
        styles.wrapper + ' ' + (target.likes > 0 ? styles.wrapperActive : '')
      }
    >
      <i className='fa-solid fa-thumbs-up'></i>
      <p className={styles.text}>{target.likes} likes</p>
    </div>
  );
}
