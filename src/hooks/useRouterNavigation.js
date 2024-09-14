import { useNavigate } from 'react-router-dom'

export const useHistoryNavigation = () => {
  const navigate = useNavigate();

  return (page) => {
    navigate(page);
  };
};

export default useHistoryNavigation;