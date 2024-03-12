/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import { IImage } from '../models/image';
import { IPost } from '../models/post';
import styles from './ImageViewer.module.css';
import ProfileHeader from './ProfileHeader';
import { getPostImage } from '../util/url';

export default function ImageViewer({
  target,
}: {
  target?: IPost;
}): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  if (target === undefined) return <></>;

  console.log(target.images);

  function nextImage(): void {
    if (target)
      setCurrentIndex((curr) =>
        curr >= target.images.length - 1 ? 0 : curr + 1
      );
  }

  function prevImage(): void {
    if (target)
      setCurrentIndex((curr) =>
        curr <= 0 ? target.images.length - 1 : curr - 1
      );
  }

  function getImage(): IImage | undefined {
    return target?.images[currentIndex] || undefined;
  }

  const image = getImage();

  if (image)
    return (
      <div className={styles.imageViewer}>
        <i className={styles.btnClose + ' fa-solid fa-xmark'}></i>
        <div className={styles.imageCurrent}>
          <i
            onClick={prevImage}
            className={styles.arrowLeft + ' fa-solid fa-left-long'}
          ></i>
          <img src={getPostImage(image.url, 'large')} className={styles.img} />
          <i
            onClick={nextImage}
            className={styles.arrowRight + ' fa-solid fa-right-long'}
          ></i>
        </div>

        <div className={styles.imageViewerDesc}>
          <ProfileHeader user={target.user} date={target.createdAt} />
        </div>
      </div>
    );

  return <></>;
}
