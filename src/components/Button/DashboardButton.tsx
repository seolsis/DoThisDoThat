import Image from 'next/image';
import addIcon from '../../assets/icons/addIcon.svg';
import styles from './DashboardButton.module.scss';

interface DashboardButtonProps {
  children?: string;
  type:
    | 'columnLarge'
    | 'columnLong'
    | 'columnSmall'
    | 'taskLarge'
    | 'taskLong'
    | 'taskSmall'
    | 'dashboardLarge'
    | 'dashboardMedium'
    | 'dashboardSmall';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const DashboardButton = ({ children, type, onClick }: DashboardButtonProps) => {
  return (
    <button className={styles[type]} onClick={onClick}>
      {children}
      <Image className={styles.icon} src={addIcon} alt="addIcon" />
    </button>
  );
};

export default DashboardButton;
