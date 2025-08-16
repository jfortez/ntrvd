type LoginProps = {
  onSubmit: () => void;
};

const Login = ({ onSubmit }: LoginProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return <form onSubmit={handleSubmit}>Login</form>;
};

export default Login;
