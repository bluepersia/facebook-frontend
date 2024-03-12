import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import styles from './Main.module.css';
import { AppContext } from '../App';
import { apiUrl, getPostImage } from '../util/url';
import useFetch from '../hooks/useFetch';
import { IPost } from '../models/post';
import ProfileImg, { Size } from '../components/ProfileImage';
import ProfileHeader from '../components/ProfileHeader';

type RelatedPostData = {
  data: {
    posts: IPost[];
  };
};

type CreateData = {
  data: {
    post: IPost;
  };
};

type CreateForm = {
  text: string;
};

const relatedPostsUrl = apiUrl + '/posts/related-posts';

export default function Main(): JSX.Element {
  const [search, setSearch] = useState<string>('');
  const { user } = useContext(AppContext);
  const [createForm, setCreateForm] = useState<CreateForm>({
    text: '',
  });
  const postsFetch = useFetch<RelatedPostData>();
  const createFetch = useFetch<CreateData>();

  useEffect(() => {
    console.log(postsFetch.data);
  }, [postsFetch.data]);

  useEffect(() => {
    postsFetch.refetch(relatedPostsUrl);
  }, []);

  useEffect(() => {
    if (createFetch.data) postsFetch.refetch(relatedPostsUrl);
  }, [createFetch.data]);

  function handleSearchChange(e: ChangeEvent): void {
    setSearch((e.target as HTMLInputElement).value);
  }

  function handleCreateInputChange(e: ChangeEvent): void {
    setCreateForm((form) => ({
      ...form,
      text: (e.target as HTMLInputElement).value,
    }));
  }

  function handleFormSubmit(e: FormEvent): void {
    e.preventDefault();

    createFetch.refetch(apiUrl + '/posts/', {
      method: 'POST',
      body: new FormData(e.target as HTMLFormElement),
    });
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <input
          type='text'
          className='input'
          placeholder='Search'
          value={search}
          onChange={handleSearchChange}
        />
      </header>{' '}
      <section className={styles.regionLeft}>
        {user && <ProfileHeader user={user} />}
      </section>{' '}
      <main className={styles.regionMain}>
        {user && (
          <div className={styles.newPost}>
            <ProfileImg url={user.imageProfile} size={Size.small} />
            <form className={styles.formNewPost} onSubmit={handleFormSubmit}>
              <textarea
                placeholder={`What's on your mind, ${user.firstName}?`}
                className={styles.inputTextArea}
                name='text'
                value={createForm.text}
                onChange={handleCreateInputChange}
              />
              <input
                type='file'
                max={100}
                multiple={true}
                accept='image/*'
                name='images'
              />
              <button className={styles.btnSubmit + ' btn-blue'}>Submit</button>
              {createFetch.error && (
                <h3 className='error'>{createFetch.error.message}</h3>
              )}
            </form>
          </div>
        )}
        <div className={styles.relatedPosts}>
          {postsFetch.isLoading && <h3>Loading...</h3>}
          {postsFetch.error && (
            <h3 className='error'>{postsFetch.error.message}</h3>
          )}
          {postsFetch.data &&
            postsFetch.data.data.posts.map((post, i) => (
              <div key={i} className={styles.relatedPost}>
                <header className={styles.relatedPostHeader}>
                  <ProfileHeader user={post.user} />
                  <p className={styles.relatedPostDate}>
                    {post.createdAt.toLocaleString()}
                  </p>
                </header>
                <p>{post.text}</p>
                <div className={styles.postImages}>
                  {post.images &&
                    post.images.map((img) => (
                      <img
                        src={getPostImage(img.url, 'small')}
                        className={styles.imgPost}
                      />
                    ))}
                </div>
              </div>
            ))}
        </div>
      </main>
      <section className={styles.regionRight}></section>
    </div>
  );
}
