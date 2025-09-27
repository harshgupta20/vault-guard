import { useEffect } from 'react'
import { useNavigate } from 'react-router' // useNavigate, not Navigate

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/dashboard');
  }, [navigate]);

  return (
    <div>
      Redirecting...
    </div>
  );
};

export default Home;
