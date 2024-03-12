import { IUser } from '../models/user';
import styles from './ProfileHeader.module.css';
import ProfileImg, { Size } from './ProfileImage';

export default function ProfileHeader({ user }: { user: IUser }): JSX.Element {
  return (
    <div className={styles.header}>
      <ProfileImg url={user.imageProfile} size={Size.small} />
      <h3 className={styles.fullName}>
        {user.firstName} {user.lastName}
      </h3>
    </div>
  );
}
