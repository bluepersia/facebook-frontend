/* eslint-disable react-hooks/rules-of-hooks */
import { useContext, useEffect, useState } from 'react';
import { IImage } from '../models/image';
import { IPost } from '../models/post';
import styles from './ImageViewer.module.css';
import ProfileHeader from './ProfileHeader';
import { apiUrl, getPostImage } from '../util/url';
import { AppContext } from '../App';
import LikesCounter from './LikesCounter';
import useFetch from '../hooks/useFetch';
import Comments from './Comments';

type ImageData = {
  data: {
    doc: IImage;
  };
};

export default function ImageViewer({
  target,
}: {
  target: IPost;
}): JSX.Element {
  const [images, setImages] = useState<IImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { setViewerTarget } = useContext(AppContext);
  const { data, refetch } = useFetch<ImageData>();

  useEffect(() => {
    setImages(target.images || []);
  }, [target]);

  useEffect(() => {
    if (data) {
      const image = data.data.doc;
      const index = images.findIndex((img) => img._id === image._id);

      if (index > -1)
        setImages((images) => [
          ...images.slice(0, index),
          image,
          ...images.slice(index + 1),
        ]);
    }
  }, [data]);

  function invalidate(): void {
    fetchImage();
  }

  function fetchImage(): void {
    const image = getImage();
    if (image) refetch(`${apiUrl}/images/${image._id}`);
  }

  function nextImage(): void {
    setCurrentIndex((curr) =>
      curr >= target.images.length - 1 ? 0 : curr + 1
    );
  }

  function prevImage(): void {
    setCurrentIndex((curr) =>
      curr <= 0 ? target.images.length - 1 : curr - 1
    );
  }

  function getImage(): IImage | null {
    return images.length > 0 ? images[currentIndex] : null;
  }

  const image = getImage();

  if (!image) return <></>;

  return (
    <div className={styles.imageViewer}>
      <i
        onClick={() => setViewerTarget(undefined)}
        className={styles.btnClose + ' fa-solid fa-xmark'}
      ></i>
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
        <LikesCounter target={image} invalidate={invalidate} />
        <Comments target={image} />
      </div>
    </div>
  );
}
