import { useEffect } from 'react';
import useFetch, { State } from '../hooks/useFetch';
import { IImage } from '../models/image';
import { IPost } from '../models/post';
import { apiUrl } from '../util/url';
import styles from './LikesCounter.module.css';

export default function LikesCounter({
  target,
  invalidate,
}: {
  target: IPost | IImage;
  invalidate: (target: IPost | IImage) => void;
}): JSX.Element {
  const { refetch, state } = useFetch();

  useEffect(() => {
    if (state === State.Success) invalidate(target);
  }, [state]);

  function handleClick(): void {
    refetch(`${apiUrl}/reactions/toggle`, {
      method: 'POST',
      body: JSON.stringify({
        target: instanceOfTargetIsPost(target) ? 'post' : 'image',
        targetId: target._id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function instanceOfTargetIsPost(target: any): target is IPost {
    return 'isPost' in target;
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
