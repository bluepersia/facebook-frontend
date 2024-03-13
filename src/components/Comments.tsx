import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { IImage } from '../models/image';
import { IPost } from '../models/post';
import styles from './Comments.module.css';
import useFetch, { State } from '../hooks/useFetch';
import { IComment } from '../models/comment';
import { apiUrl } from '../util/url';
import LikesCounter from './LikesCounter';
import { ILikeable } from '../models/likeable';
import { AppContext } from '../App';
import ProfileHeader from './ProfileHeader';

type CommentsData = {
  data: {
    docs: IComment[];
  };
};
type CommentData = {
  data: {
    doc: IComment;
  };
};
export default function Comments({
  target,
  showAtStart = true,
  forceShow = false,
  level = 0,
}: {
  target: IPost | IImage | IComment;
  showAtStart?: boolean;
  forceShow?: boolean;
  level?: number;
}): JSX.Element {
  const [comments, setComments] = useState<IComment[]>([]);
  const [commentsShow, setCommentsShow] = useState<boolean[]>([]);
  const { isLoading, data, refetch } = useFetch<CommentsData>();
  const fetchSingle = useFetch<CommentData>();
  const createSingle = useFetch<CommentData>();
  const deleteSingle = useFetch<null>();
  const [show, setShow] = useState<boolean>(showAtStart);
  const [commentingTarget, setCommentingTarget] = useState<
    IImage | IPost | IComment
  >();
  const [commentText, setCommentText] = useState<string>('');

  const { user } = useContext(AppContext);

  function getCommentsShowByIndex(index: number): boolean {
    if (commentsShow.length > index) return commentsShow[index];
    else return false;
  }

  function setCommentsShowById(id: string, val: boolean): void {
    setCommentsShow((commentsShowAtStart) => {
      let newArr = [...commentsShowAtStart];

      const index = comments.findIndex((comment) => comment._id === id);

      if (newArr.length <= index)
        newArr = newArr.fill(false, newArr.length, index + 1);

      newArr[index] = val;

      return newArr;
    });
  }

  async function fetchComments(): Promise<void> {
    await refetch(`${apiUrl}/comments?${target.type}=${target._id}`);
  }

  async function deleteComment(id: string): Promise<void> {
    await deleteSingle.refetch(`${apiUrl}/comments/${id}`, {
      method: 'DELETE',
    });
  }

  function handleCommentChange(e: ChangeEvent): void {
    setCommentText((e.target as HTMLTextAreaElement).value);
  }

  async function createComment(): Promise<void> {
    if (!commentingTarget) return;

    if (createSingle.state === State.Pending) return;

    createSingle.setExtra(commentingTarget);
    await createSingle.refetch(`${apiUrl}/comments`, {
      method: 'POST',
      body: JSON.stringify({
        [commentingTarget.type]: commentingTarget._id,
        text: commentText,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  function handleCommentSubmit(e: FormEvent): void {
    e.preventDefault();

    createComment();
  }

  useEffect(() => {
    setCommentsShow((arr) => arr.map(() => false));
  }, []);

  useEffect(() => {
    if (forceShow) setShow(true);
  }, [forceShow]);

  useEffect(() => {
    fetchComments();
  }, [target]);

  useEffect(() => {
    if (data) setComments(data.data.docs);
  }, [data]);

  useEffect(() => {
    if (fetchSingle.data) {
      const comment = fetchSingle.data.data.doc;
      setComments((comments) => {
        const index = comments.findIndex((c) => c._id === comment._id);
        return [
          ...comments.slice(0, index),
          comment,
          ...comments.slice(index + 1),
        ];
      });
    }
  }, [fetchSingle.data]);

  useEffect(() => {
    if (createSingle.state === State.Success) {
      if (createSingle.extra.type === 'comment')
        setCommentsShowById(createSingle.extra._id, true);

      fetchComments();
    }
  }, [createSingle.state]);

  useEffect(() => {
    if (deleteSingle.state === State.Success) fetchComments();
  }, [deleteSingle.state]);

  function invalidate(target: ILikeable): void {
    fetchSingle.refetch(`${apiUrl}/comments/${target._id}`);
  }

  function isMine(comment: IComment) {
    return comment.user._id === user?._id || false;
  }

  const showReply = level <= 2;

  if (show)
    return (
      <>
        {comments.length > 0 && (
          <div className={styles.comments + ' ' + styles[`level-${level}`]}>
            {isLoading && <h3>Loading...</h3>}
            {target.type === 'comment' && (
              <button className={styles.btnHide} onClick={() => setShow(false)}>
                Hide comments
              </button>
            )}
            {comments.map((comment, commentIndex) => (
              <div key={comment._id} className={styles.comment}>
                <ProfileHeader user={comment.user} />
                <p>{comment.text}</p>
                <div className={styles.response}>
                  <LikesCounter target={comment} invalidate={invalidate} />
                  <button onClick={() => setCommentingTarget(comment)}>
                    Reply
                  </button>

                  {isMine(comment) && (
                    <button onClick={() => deleteComment(comment._id)}>
                      Delete
                    </button>
                  )}
                </div>
                <Comments
                  target={comment}
                  level={level + 1}
                  showAtStart={false}
                  forceShow={getCommentsShowByIndex(commentIndex)}
                />
              </div>
            ))}
          </div>
        )}
        {commentingTarget &&
          (commentingTarget === target ||
            comments.includes(commentingTarget as IComment)) &&
          showReply && (
            <form
              onSubmit={handleCommentSubmit}
              className={
                styles.commentSubmit +
                ' ' +
                (commentingTarget.type === 'comment'
                  ? styles[`level-${level + 1}`]
                  : '')
              }
            >
              <textarea
                name='comment'
                onChange={handleCommentChange}
                className={styles.commentArea}
                value={commentText}
              />
              <div className={styles.commentBtns}>
                <button type='submit' className='btn btn-blue'>
                  Post
                </button>
                <button
                  onClick={() => setCommentingTarget(undefined)}
                  className='btn btn-blue'
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

        {(!commentingTarget || commentingTarget.type === 'comment') &&
          target.type != 'comment' &&
          showReply && (
            <button
              onClick={() => setCommentingTarget(target)}
              className={styles.btnComment + ' btn btn-blue'}
            >
              Comment
            </button>
          )}
      </>
    );

  if (showReply && comments.length > 0)
    return (
      <button className={styles.btnReadMore} onClick={() => setShow(true)}>
        Show comments ({comments.length})
      </button>
    );

  return <></>;
}
