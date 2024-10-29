import { useState } from 'react';
import '../styles/Burger.css'; 
import RightNav from './RightNav';
import BurgerIcon from '../icons/BurgerIcon';

export interface BurgerProps {
    open: boolean;
}
  
const Burger = () => {
  const [isOpened, setIsOpened] = useState(false);

  const handleClick = () => {
    setIsOpened(!isOpened); 
  };
  return (
    <>
      <button className='styled-burger'>
        <button  className={`menu ${isOpened ? 'opened' : ''}`} 
        onClick={handleClick}  
        aria-expanded={isOpened} 
        aria-label="Main Menu">
          <BurgerIcon/>
        </button>
      </button>
      <RightNav open={isOpened}/>
    </>
  )
}

export default Burger